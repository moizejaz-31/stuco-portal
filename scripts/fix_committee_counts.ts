
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or service_role key if you have it, but consistent with update_committees.ts

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixCommitteeCounts() {
    console.log('Fetching committees...')
    const { data: committees, error } = await supabase.from('committees').select('*')

    if (error) {
        console.error('Error fetching committees:', error)
        return
    }

    console.log(`Found ${committees.length} committees. Processing...`)

    for (const committee of committees) {
        let needsUpdate = false
        const originalStructure = committee.structure || []
        const newStructure = [...originalStructure]

        const chairCount = (committee.chairs || []).length
        const memberCount = (committee.members || []).length

        for (let i = 0; i < newStructure.length; i++) {
            let line = newStructure[i]

            // Regex to find "X Chairs" or "X Committee Chairs"
            // Matches optional words before Chairs, looking for a number at the start
            // Example: "2 Welfare Chairs" -> matches "2" and "Welfare Chairs"

            if (line.toLowerCase().includes('chair')) {
                // Try to replace the number at the start
                const match = line.match(/^(\d+)\s+(.+)/)
                if (match) {
                    const currentNum = parseInt(match[1])
                    const restOfString = match[2]

                    if (currentNum !== chairCount) {
                        // Special singular/plural handling if needed, but usually just "X Chairs"
                        // If chairCount is 1, maybe "1 Chair"? Let's just stick to "X [Rest of String]" but handle "Chair/Chairs" if strictly needed.
                        // Ideally we keep the text "Welfare Chairs" and just change the number.

                        // Check if we need to singularize the text if count became 1? 
                        // The user prompt says "we say 2 welfair chairs, but there are 5", so just updating number seems safest.

                        const newLine = `${chairCount} ${restOfString}`
                        if (newLine !== line) {
                            console.log(`[${committee.name}] Updating structure: "${line}" -> "${newLine}"`)
                            newStructure[i] = newLine
                            needsUpdate = true
                        }
                    }
                }
            } else if (line.toLowerCase().includes('member')) {
                const match = line.match(/^(\d+)\s+(.+)/)
                if (match) {
                    const currentNum = parseInt(match[1])
                    const restOfString = match[2]

                    if (currentNum !== memberCount) {
                        const newLine = `${memberCount} ${restOfString}`
                        if (newLine !== line) {
                            console.log(`[${committee.name}] Updating structure: "${line}" -> "${newLine}"`)
                            newStructure[i] = newLine
                            needsUpdate = true
                        }
                    }
                }
            }
        }

        if (needsUpdate) {
            const { error: updateError } = await supabase
                .from('committees')
                .update({ structure: newStructure })
                .eq('id', committee.id)

            if (updateError) {
                console.error(`Failed to update ${committee.name}:`, updateError.message)
            } else {
                console.log(`Saved updates for ${committee.name}`)
            }
        }
    }
    console.log('Done.')
}

fixCommitteeCounts()
