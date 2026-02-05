
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or service role key if available, but checking anon first

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateCommittees() {
    console.log('Fetching committees...')
    const { data: committees, error } = await supabase.from('committees').select('*')

    if (error) {
        console.error('Error fetching committees:', error)
        return
    }

    console.log(`Found ${committees.length} committees. Processing...`)

    for (const committee of committees) {
        let needsUpdate = false
        let updatedChairs = [...(committee.chairs || [])]
        let updatedMembers = [...(committee.members || [])]

        // 1. Replace "Ahmed Bin Hussain" with "Ashoraim Orakzai"
        const replaceName = (list: string[]) => {
            return list.map(name => {
                if (name.toLowerCase().includes('ahmed bin hussain')) {
                    needsUpdate = true
                    return 'Ashoraim Orakzai'
                }
                // Check for close matches or exact matches
                if (name === 'Ahmed Bin Hussain' || name === 'Ahmed bin Hussain') {
                    needsUpdate = true
                    return 'Ashoraim Orakzai'
                }
                return name
            })
        }

        updatedChairs = replaceName(updatedChairs)
        updatedMembers = replaceName(updatedMembers)

        // 2. Add "Ashoraim Orakzai" to Residence and Campus Development if not present
        // Note: The user said "Residence Campus development", assuming these are two separate or one specific committee.
        // Based on previous file reads, there is a "Residence" committee and a "Campus Development" committee.
        // I will check for both.

        const targetCommittees = ['Residence', 'Campus Development']
        if (targetCommittees.some(target => committee.name.includes(target))) {
            if (!updatedMembers.includes('Ashoraim Orakzai') && !updatedChairs.includes('Ashoraim Orakzai')) {
                console.log(`Adding Ashoraim to ${committee.name}`)
                updatedMembers.push('Ashoraim Orakzai')
                needsUpdate = true
            }
        }

        if (needsUpdate) {
            console.log(`Updating committee: ${committee.name}`)
            const { error: updateError } = await supabase
                .from('committees')
                .update({ chairs: updatedChairs, members: updatedMembers })
                .eq('id', committee.id)

            if (updateError) {
                console.error(`Failed to update ${committee.name}:`, updateError.message)
            } else {
                console.log(`Successfully updated ${committee.name}`)
            }
        }
    }
    console.log('Done.')
}

updateCommittees()
