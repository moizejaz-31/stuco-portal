'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Pencil, Trash2, X, GripVertical, ArrowUpDown } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Committee {
    id: string
    name: string
    short_description: string
    purpose: string
    structure: string[]
    roles: string[]
    chairs: string[]
    members: string[]
    priority?: number
}

// --- Sortable Item Component ---
function SortableItem(props: { id: string; committee: Committee }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-white p-3 rounded-lg border border-stone-200 flex items-center gap-3 mb-2 shadow-sm">
            <button {...attributes} {...listeners} className="text-stone-400 hover:text-maroon cursor-grab active:cursor-grabbing touch-none p-1">
                <GripVertical size={20} />
            </button>
            <div className="flex-1">
                <div className="font-bold text-stone-700">{props.committee.name}</div>
            </div>
        </div>
    )
}

export default function AdminCommittees() {
    const [committees, setCommittees] = useState<Committee[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<Committee>>({})

    // Reorder State
    const [isReordering, setIsReordering] = useState(false)
    const [reorderList, setReorderList] = useState<Committee[]>([])
    const [savingOrder, setSavingOrder] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        fetchCommittees()
    }, [])

    async function fetchCommittees() {
        setLoading(true)
        const { data } = await supabase
            .from('committees')
            .select('*')
            .order('priority', { ascending: false })
            .order('name')

        if (data) setCommittees(data)
        setLoading(false)
    }

    function handleEdit(committee: Committee) {
        setEditingId(committee.id)
        setFormData(committee)
    }

    function handleAddNew() {
        setEditingId('new')
        setFormData({
            name: '',
            short_description: '',
            purpose: '',
            structure: [],
            roles: [],
            chairs: [],
            members: [],
            priority: 0
        })
    }

    async function handleSave() {
        if (!formData.name) return alert('Name is required')

        const payload = {
            ...formData,
            // ensure arrays are at least empty arrays
            structure: formData.structure || [],
            roles: formData.roles || [],
            chairs: formData.chairs || [],
            members: formData.members || [],
            slug: formData.name.toLowerCase().replace(/\s+/g, '-') // simple slug gen
        }

        // Ensure priority if new
        if (editingId === 'new' && payload.priority === undefined) {
            payload.priority = 0
        }

        if (editingId === 'new') {
            const { error } = await supabase.from('committees').insert([payload])
            if (error) alert('Error creating: ' + error.message)
        } else {
            const { error } = await supabase.from('committees').update(payload).eq('id', editingId)
            if (error) alert('Error updating: ' + error.message)
        }

        setEditingId(null)
        fetchCommittees()
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this committee?')) return
        const { error } = await supabase.from('committees').delete().eq('id', id)
        if (error) alert('Error deleting: ' + error.message)
        else fetchCommittees()
    }

    // Hepler for array inputs
    function ArrayInput({ label, value, field }: { label: string, value: string[], field: keyof Committee }) {
        return (
            <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">{label}</label>
                <textarea
                    className="w-full text-sm p-2 border rounded-lg"
                    rows={4}
                    value={value?.join('\n')}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value.split('\n') })}
                    placeholder="One item per line"
                />
            </div>
        )
    }

    // --- Drag and Drop Logic ---
    function openReorder() {
        setReorderList([...committees])
        setIsReordering(true)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id) {
            setReorderList((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    async function saveOrder() {
        setSavingOrder(true)
        const updates = reorderList.map((committee, index) => {
            const newPriority = reorderList.length - index
            return supabase
                .from('committees')
                .update({ priority: newPriority })
                .eq('id', committee.id)
        })

        await Promise.all(updates)
        setSavingOrder(false)
        setIsReordering(false)
        fetchCommittees()
    }

    return (
        <div className="flex bg-stone-50 min-h-screen">
            <div className="hidden md:block">
                <AdminSidebar />
            </div>

            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="font-serif text-3xl font-bold text-maroon">Manage Committees</h1>
                        <div className="flex gap-2">
                            <button onClick={openReorder} className="bg-white border border-stone-300 text-stone-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-stone-50">
                                <ArrowUpDown size={20} /> Reorder
                            </button>
                            <button onClick={handleAddNew} className="bg-maroon text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#3E000C]">
                                <Plus size={20} /> Add New
                            </button>
                        </div>
                    </div>

                    {loading ? <p>Loading...</p> : (
                        <div className="grid gap-4">
                            {committees.map(committee => (
                                <div key={committee.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-xl text-stone-800">{committee.name}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <p className="text-sm text-stone-500 line-clamp-1">{committee.short_description}</p>
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-xs font-bold uppercase rounded text-blue-700">
                                                Priority: {committee.priority || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(committee)} className="p-2 text-stone-500 hover:text-maroon bg-stone-50 rounded-lg">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(committee.id)} className="p-2 text-stone-500 hover:text-red-600 bg-stone-50 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal for Edit/Add */}
                    {editingId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
                            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-serif text-2xl font-bold text-maroon">
                                        {editingId === 'new' ? 'Create Committee' : 'Edit Committee'}
                                    </h2>
                                    <button onClick={() => setEditingId(null)} className="p-2 hover:bg-stone-100 rounded-full">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1">Name</label>
                                        <input
                                            className="w-full p-2 border rounded-lg"
                                            value={formData.name || ''}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1">Short Description</label>
                                        <input
                                            className="w-full p-2 border rounded-lg"
                                            value={formData.short_description || ''}
                                            onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1">Purpose (Full Text)</label>
                                        <textarea
                                            className="w-full p-2 border rounded-lg"
                                            rows={3}
                                            value={formData.purpose || ''}
                                            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <ArrayInput label="Chairs (one per line)" value={formData.chairs || []} field="chairs" />
                                        <ArrayInput label="Members (one per line)" value={formData.members || []} field="members" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ArrayInput label="Structure (one per line)" value={formData.structure || []} field="structure" />
                                        <ArrayInput label="Roles (one per line)" value={formData.roles || []} field="roles" />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-lg">Cancel</button>
                                    <button onClick={handleSave} className="px-6 py-2 bg-maroon text-white font-bold rounded-lg hover:bg-[#3E000C]">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reorder Modal */}
                    {isReordering && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
                            <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                    <h2 className="font-serif text-2xl font-bold text-maroon">
                                        Reorder Committees
                                    </h2>
                                    <button onClick={() => setIsReordering(false)}><X /></button>
                                </div>
                                <p className="text-stone-500 text-sm mb-4">Drag items to reorder. Top item appears first.</p>

                                <div className="flex-1 overflow-y-auto min-h-[300px]">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={reorderList.map(p => p.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {reorderList.map(committee => (
                                                <SortableItem key={committee.id} id={committee.id} committee={committee} />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                                    <button onClick={() => setIsReordering(false)} className="px-4 py-2 font-bold text-stone-500">Cancel</button>
                                    <button onClick={saveOrder} disabled={savingOrder} className="px-6 py-2 bg-maroon text-white font-bold rounded-lg disabled:opacity-50">
                                        {savingOrder ? 'Saving...' : 'Save Order'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
