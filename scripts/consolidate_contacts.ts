
const executiveMembers = [
    { name: "Junaid Asghar Tarar", role: "President", office: "Student Council Office" },
    { name: "Nishat Zafar", role: "Vice President", office: "Student Council Office" },
    { name: "Altamash Jawaid", role: "General Secretary", office: "Student Council Office" },
]

const rawCommitteeMembers = [
    { name: "Muhammad Suleman Butt", role: "Chair (Non-Academic DC)", committee: "Disciplinary Committee" },
    { name: "Nishat Zafar", role: "Chair (Non-Academic DC)", committee: "Disciplinary Committee" },
    { name: "Mahnoor Mirza", role: "Chair (HSS)", committee: "Disciplinary Committee" },
    { name: "Sauban Numan", role: "Chair (HSS)", committee: "Disciplinary Committee" },
    { name: "Muhammad Bilal Zafar", role: "Chair (SDSB)", committee: "Disciplinary Committee" },
    { name: "Ashoraim Orakzai", role: "Chair (SDSB)", committee: "Disciplinary Committee" },
    { name: "Mirza Saad Iftikhar", role: "Chair (SAHSOL)", committee: "Disciplinary Committee" },
    { name: "Abdul Hadi", role: "Chair (SSE)", committee: "Disciplinary Committee" },
    { name: "Muhammad Ahsan Kaleem", role: "Chair (SSE)", committee: "Disciplinary Committee" },
    { name: "Mahrukh", role: "Chair (SOE)", committee: "Disciplinary Committee" },
    { name: "Hajira Batool", role: "Chair", committee: "Health & Wellness" },
    { name: "Eshal Faisal", role: "Chair", committee: "Health & Wellness" },
    { name: "Sauban Numan", role: "Member", committee: "Health & Wellness" },
    { name: "Ahsan Kaleem", role: "Member", committee: "Health & Wellness" },
    { name: "Moiz Ejaz", role: "Chair of Welfare and Academic Affairs", committee: "Community Welfare" },
    { name: "Shireena Baig", role: "Chair", committee: "Community Welfare" },
    { name: "Sauban Numan", role: "Chair", committee: "Community Welfare" },
    { name: "Abdul Hadi", role: "Chair", committee: "Community Welfare" },
    { name: "Zainab Rana", role: "Chair", committee: "Community Welfare" },
    { name: "Ahsan Kaleem", role: "Member", committee: "Community Welfare" },
    { name: "Maaidah", role: "Member", committee: "Community Welfare" },
    { name: "Shakirullah", role: "Member", committee: "Community Welfare" },
    { name: "Eshal Faisal", role: "Chair", committee: "Campus Development" },
    { name: "Shireena Baig", role: "Chair", committee: "Campus Development" },
    { name: "Muhammad Bilal Zafar", role: "Chair", committee: "Campus Development" },
    { name: "Wania Iftikhar", role: "Member", committee: "Campus Development" },
    { name: "Ahmed Sultan", role: "Member", committee: "Campus Development" },
    { name: "Amna Asim", role: "Member", committee: "Campus Development" },
    { name: "Tabish Khaqan", role: "Member", committee: "Campus Development" },
    { name: "Ashoraim Orakzai", role: "Member", committee: "Campus Development" },
    { name: "Muhammad Salman Ahmad", role: "Chair", committee: "Career Services" },
    { name: "Maaidah Kaleem Butt", role: "Chair", committee: "Career Services" },
    { name: "Asim Bangash", role: "Chair", committee: "Career Services" },
    { name: "Mahrukh", role: "Member", committee: "Career Services" },
    { name: "Suleman Butt", role: "Member", committee: "Career Services" },
    { name: "Nashmiya", role: "Member", committee: "Career Services" },
    { name: "Nashmiya", role: "Chair", committee: "Internal Affairs" },
    { name: "Wania Iftikhar", role: "Chair", committee: "Internal Affairs" },
    // { name: "Amna Asim", role: "Chair", committee: "Diversity & Inclusion" }, // Not in duplicate lists but check
    { name: "Amna Asim", role: "Chair", committee: "Diversity & Inclusion" },
    { name: "Muhammad Owais Chandio", role: "Chair", committee: "Diversity & Inclusion" },
    { name: "Muhammad Ahsan Kaleem", role: "Chair", committee: "Graduate Affairs" },
    { name: "Asim Bangash", role: "Chair", committee: "Graduate Affairs" },
    { name: "Abdullah Khan", role: "Chair", committee: "Graduate Affairs" },
    { name: "Mahnoor Mirza", role: "Chair", committee: "Food & Pricing" },
    { name: "Muhammad Owais Chandio", role: "Chair", committee: "Food & Pricing" },
    { name: "Sauban Nauman", role: "Chair", committee: "Food & Pricing" },
    { name: "Zainab Rana", role: "Chair", committee: "Harassment Support" },
    { name: "Jaweria Shabbir", role: "Chair", committee: "Harassment Support" },
    { name: "Syed Tabish Khaqan", role: "Chair", committee: "Academic Affairs" },
    { name: "Ahmed Sultan", role: "Chair", committee: "Academic Affairs" },
    { name: "Muhammad Bilal Zafar", role: "Chair", committee: "Special Events" },
    { name: "Nashmiya", role: "Chair", committee: "Special Events" },
    { name: "Zainab Rana", role: "Chair", committee: "Special Events" },
    { name: "Jaweria Shabbir", role: "Chair", committee: "Sports" },
    { name: "Ashoraim Orakzai", role: "Chair", committee: "Sports" },
    { name: "Mirza Saad Iftikhar", role: "Chair", committee: "Residence" },
    { name: "Shireena Baig", role: "Chair", committee: "Residence" },
    { name: "Ashoraim Orakzai", role: "Member", committee: "Residence" },
]

// Normalize Names
function normalizeName(name: string) {
    return name.trim()
        .replace(/Sauban Nauman/i, 'Sauban Numan') // Fix typo
        .replace(/Muhammad Ahsan Kaleem/i, 'Ahsan Kaleem') // Consolidate? Or keep specific? Let's check duplicates
    // Ahsan Kaleem is Member Health, Member Community. Muhammad Ahsan Kaleem is Chair SSE, Chair Graduate.
    // Usually these are the same person. I'll normalize to the longer one if ambiguous, or checking overlap.
    // Looking at the data: "Sauban Numan" vs "Sauban Nauman".
}

const map = new Map()

// Helper to add
function add(name: string, role: string, committee: string) {
    const key = normalizeName(name)
    if (!map.has(key)) {
        map.set(key, { name: key, chairs: [], members: [] })
    }
    const person = map.get(key)

    // Normalize role
    // "Chair (HSS)", "Chair", "Chair of Welfare..."

    const isChair = role.toLowerCase().includes('chair')

    if (isChair) {
        // Extract committee details if embedded in role, or use committee field
        let committeeName = committee
        if (role.toLowerCase().includes('chair (')) {
            // e.g. "Chair (Non-Academic DC)"
            // Keep the specific chair title as the content?
            // User wants "Chair of X and Y".
            // If role is just "Chair", use "Chair of " + committee.
            // If role is "Chair (SDSB)", use "Chair (SDSB) of " + committee? Or just "Chair (SDSB) - Disciplinary Committee"
        }

        person.chairs.push({ role, committee })
    } else {
        person.members.push({ role, committee })
    }
}

rawCommitteeMembers.forEach(m => add(m.name, m.role, m.committee))

// Process final list
const consolidated = []

for (const [name, data] of map.entries()) {
    // Check if in Exec list
    const isExec = executiveMembers.some(e => normalizeName(e.name) === name)

    // If Exec, we might skip adding them to committee list if we want to avoid duplicates on the page,
    // BUT the user said "President... stay the same". This implies the *Executive Section* stays the same.
    // If they are also committee chairs, usually you listed them separately.
    // However, "do what you did for Moiz Ejaz... for all people".
    // Moiz was a Chair and Member.
    // I will assume if they are Exec, they should ONLY appear in the Exec section (top) if we want to "consolidate".
    // But currently Execs are in `executiveMembers` array and Committees in `committeeMembers`.
    // The previous code concatenated them: `[...executiveMembers, ...committeeMembers]`.
    // So if I keep them in `committeeMembers`, they appear twice.
    // User: "President Vice-President & General secretary stay the same".
    // I will REMOVE them from `committeeMembers` if they are already in `executiveMembers` to avoid duplication.
    // Nishat Zafar is VP.

    if (isExec) continue

    let finalRole = ""
    let finalCommittee = "" // This field is used for filtering and display mostly.

    if (data.chairs.length > 0) {
        // Consolidate Chair roles
        // Strategy: "Chair of A, B, and C"

        // Group by Role Title?
        // e.g. "Chair" of X, "Chair (HSS)" of Y.

        const committees = data.chairs.map((c: any) => {
            // Clean up role
            if (c.role === 'Chair') return c.committee
            if (c.role.includes('Chair (')) {
                // "Chair (SDSB)" -> "Disciplinary Committee (SDSB Chair)"?
                // Or "Chair (SDSB) of Disciplinary Committee"
                // Simplified: just "Disciplinary Committee" unless the role distinguishes them?
                // Actually "Chair (SDSB)" is important context.
                return `${c.committee} (${c.role.replace('Chair', '').trim().replace('(', '').replace(')', '')})`
            }
            if (c.role.includes('Chair of')) return c.role.replace('Chair of ', '') // Moiz case
            return c.committee
        })

        // Unique
        const uniqueCommittees = [...new Set(committees)]

        if (uniqueCommittees.length === 1) {
            finalRole = `Chair of ${uniqueCommittees[0]}`
        } else if (uniqueCommittees.length === 2) {
            finalRole = `Chair of ${uniqueCommittees[0]} & ${uniqueCommittees[1]}`
        } else {
            const last = uniqueCommittees.pop()
            finalRole = `Chair of ${uniqueCommittees.join(', ')}, & ${last}`
        }

        // If they have chair roles, IGNORE member roles.
        finalCommittee = "Committee Chair" // Generic tag or just use the first one?
        // The UI uses `(member as any).committee` to display a committee tag?
        // No, UI says: `{(member as any).committee ? 'Committee' : 'Executive'}` tag.
        // And displays `p className="text-sm text-stone-500">{member.committee}</p>`
        // If we merge, we can put the list in `committee` or `role`.
        // User example: Role="Chair of Welfare and Academic Affairs", Committee="Community Welfare" (in Moiz case I just picked one).
        // If I put "Chair of X and Y" in `role`, I can leave `committee` empty or put "Multiple Committees".

        // Actually, looking at Moiz:
        // { name: "Moiz Ejaz", role: "Chair of Welfare and Academic Affairs", committee: "Community Welfare" },
        // The `committee` field is displayed in gray below the role.
        // If I put everything in `role`, I might want to clear `committee`.
        // Or put "Chair" in Role and "X, Y, Z" in Committee.
        // User said: "write for example Chair of Welfaer and Academic Affairs etc... only add one contact block"

        // I will put the full title in `role` for high visibility, and maybe primary committee in `committee`?
        // Or just put "Student Council" in committee?
        // Let's try to fit it in `role` and put "Multiple Committees" in `committee` if > 1.

        finalCommittee = uniqueCommittees.length > 1 ? "Multiple Committees" : (uniqueCommittees[0] as string)

    } else {
        // Only Member
        if (data.members.length > 1) {
            const comms = data.members.map((m: any) => m.committee)
            const unique = [...new Set(comms)]
            finalRole = "Member of " + unique.join(', ')
            finalCommittee = "Committee Member"
        } else {
            finalRole = "Member"
            finalCommittee = data.members[0].committee
        }
    }

    consolidated.push({
        name: data.name,
        role: finalRole,
        committee: finalCommittee
    })
}

// Moiz Special Fix (Override if script generation isn't perfect for him, but script should handle it if I mapped it right)
// Moiz Roles: "Chair of Welfare and Academic Affairs" (Community Welfare).
// In raw data: Role: "Chair of Welfare...", Committee: "Community Welfare".
// He is also "Member" of Health & Wellness, Career Services.
// My script logic: "If Chair, ignore Member". So he becomes "Chair of Welfare and Academic Affairs".
// Done.

console.log(JSON.stringify(consolidated, null, 4))
