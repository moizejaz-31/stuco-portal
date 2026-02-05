
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectCommittees() {
    console.log('Fetching committees...')
    const { data: committees, error } = await supabase.from('committees').select('*')

    if (error) {
        console.error('Error fetching committees:', error)
        return
    }

    committees.forEach(c => {
        console.log(`--- ${c.name} ---`)
        console.log('Structure:', c.structure)
        console.log('Chairs:', c.chairs?.length || 0, c.chairs)
        console.log('Members:', c.members?.length || 0, c.members)
        console.log('')
    })
}

inspectCommittees()
