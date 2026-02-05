'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Pencil, Trash2, X, Upload, GripVertical, ArrowUpDown } from 'lucide-react'
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

interface Project {
    id: string
    title: string
    description: string
    status: string
    category: string
    image_url?: string
    link?: string
    priority?: number
    created_at?: string
}

// --- Sortable Item Component ---
function SortableItem(props: { id: string; project: Project }) {
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
                <div className="font-bold text-stone-700">{props.project.title}</div>
            </div>
            <div className="text-xs font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded">
                {props.project.status}
            </div>
        </div>
    )
}

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<Project>>({})
    const [uploading, setUploading] = useState(false)

    // Reorder State
    const [isReordering, setIsReordering] = useState(false)
    const [reorderList, setReorderList] = useState<Project[]>([])
    const [savingOrder, setSavingOrder] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        setLoading(true)
        // Order by priority descending first
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false })

        if (data) setProjects(data)
        setLoading(false)
    }

    function handleEdit(project: Project) {
        setEditingId(project.id)
        setFormData(project)
    }

    function handleAddNew() {
        setEditingId('new')
        setFormData({
            title: '',
            description: '',
            status: 'Ongoing',
            category: 'General',
            image_url: '',
            link: '',
            priority: 0
        })
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath)

            setFormData({ ...formData, image_url: data.publicUrl })
        } catch (error: any) {
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    async function handleSave() {
        if (!formData.title) return alert('Title is required')

        const payload = { ...formData }
        // Ensure priority is not lost if editing
        if (editingId === 'new' && payload.priority === undefined) {
            payload.priority = 0
        }

        if (editingId === 'new') {
            const { error } = await supabase.from('projects').insert([payload])
            if (error) alert('Error creating: ' + error.message)
        } else {
            const { error } = await supabase.from('projects').update(payload).eq('id', editingId)
            if (error) alert('Error updating: ' + error.message)
        }

        setEditingId(null)
        fetchProjects()
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure?')) return
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (!error) fetchProjects()
    }

    // --- Drag and Drop Logic ---
    function openReorder() {
        setReorderList([...projects])
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
        // Assign priority based on index (Top = Highest Priority)
        // List Index 0 -> Priority = Length
        // List Index Last -> Priority = 1

        const updates = reorderList.map((project, index) => {
            const newPriority = reorderList.length - index
            return supabase
                .from('projects')
                .update({ priority: newPriority })
                .eq('id', project.id)
        })

        await Promise.all(updates)

        setSavingOrder(false)
        setIsReordering(false)
        fetchProjects()
    }

    return (
        <div className="flex bg-stone-50 min-h-screen">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="font-serif text-3xl font-bold text-maroon">Manage Projects</h1>
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
                            {projects.map(project => (
                                <div key={project.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-xl text-stone-800">{project.title}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="inline-block px-2 py-1 bg-stone-100 text-xs font-bold uppercase rounded text-stone-600">
                                                {project.status}
                                            </span>
                                            {project.image_url && (
                                                <span className="inline-block px-2 py-1 bg-green-100 text-xs font-bold uppercase rounded text-green-700">
                                                    Has Image
                                                </span>
                                            )}
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-xs font-bold uppercase rounded text-blue-700">
                                                Priority: {project.priority || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(project)} className="p-2 text-stone-500 hover:text-maroon bg-stone-50 rounded-lg">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2 text-stone-500 hover:text-red-600 bg-stone-50 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && <p className="text-stone-500 italic">No projects found.</p>}
                        </div>
                    )}

                    {/* Edit/Add Modal */}
                    {editingId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
                            <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-serif text-2xl font-bold text-maroon">
                                        {editingId === 'new' ? 'Add Project' : 'Edit Project'}
                                    </h2>
                                    <button onClick={() => setEditingId(null)}><X /></button>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">Title</label>
                                    <input className="w-full p-2 border rounded-lg" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">Status</label>
                                    <select className="w-full p-2 border rounded-lg" value={formData.status || 'Ongoing'} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option>Ongoing</option>
                                        <option>Completed</option>
                                        <option>Upcoming</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">Project Link (Optional)</label>
                                    <input className="w-full p-2 border rounded-lg" placeholder="https://example.com" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">Description</label>
                                    <textarea className="w-full p-2 border rounded-lg" rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1">Project Image</label>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-600 px-4 py-2 rounded-lg flex items-center gap-2 border border-stone-300 transition">
                                            <Upload size={16} />
                                            {uploading ? 'Uploading...' : 'Upload Image'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                        {formData.image_url && (
                                            <img src={formData.image_url} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-stone-200" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <button onClick={() => setEditingId(null)} className="px-4 py-2 font-bold text-stone-500">Cancel</button>
                                    <button onClick={handleSave} disabled={uploading} className="px-6 py-2 bg-maroon text-white font-bold rounded-lg disabled:opacity-50">
                                        {uploading ? 'Wait...' : 'Save'}
                                    </button>
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
                                        Reorder Projects
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
                                            {reorderList.map(project => (
                                                <SortableItem key={project.id} id={project.id} project={project} />
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
