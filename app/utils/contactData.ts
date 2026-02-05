export interface ContactInfo {
    phone?: string;
    email?: string;
}

// Map of member names to their contact info.
// keys should match the names as they appear in the database/UI.
export const memberContacts: Record<string, ContactInfo> = {
    // Provided in prompt
    "Junaid Asghar Tarar": { phone: "+92 302 1555177" },
    "Altamash Jawaid": { phone: "+92 334 8670494" },
    "Nishat Zafar": { phone: "+92 345 0117639" },
    "Abdul Hadi": { phone: "+92 309 6126871" },
    "Ahmed Sultan": { phone: "+92 300 4635500" },
    "Amna Asim": { phone: "+92 300 8276951" },
    "Ashoraim Orakzai": { phone: "+92 333 9984974" },
    "Eshal Faisal": { phone: "+92 300 0132528" },
    "Maaidah": { phone: "+92 331 4233067" },

    // Variations for Maaidah
    "Maaidah Kaleem Butt": { phone: "+92 331 4233067" },

    "Mahnoor Mirza": { phone: "+92 300 3747791" },
    "Muhammad Bilal Zafar": { phone: "+92 319 2483245" },
    "Nashmiya": { phone: "+92 334 9883015" },
    "Sauban Numan": { phone: "+92 319 0600059" },
    "Shireena Baig": { phone: "+92 346 5580125" },

    "Syed Moiz Ejaz": { phone: "+92 316 0264786" },
    // Variations for Moiz
    "Moiz Ejaz": { phone: "+92 316 0264786" },

    "Wania Iftikhar Soomro": { phone: "+92 322 8791170" },
    // Variations for Wania
    "Wania Iftikhar": { phone: "+92 322 8791170" },

    "Zainab Rana": { phone: "+92 321 2294073" },
    "Abdullah Khan": { phone: "+92 333 6878710" },
    "Ahsan Kaleem": { phone: "+92 313 7808273" },

    "Bangash": { phone: "+92 317 1155313" },
    // Variations for Bangash
    "Asim Bangash": { phone: "+92 317 1155313" },

    "Hajra Batool": { phone: "+92 344 8929517" },
    // Variations for Hajra
    "Hajira Batool": { phone: "+92 344 8929517" },
    "Hajra": { phone: "+92 344 8929517" },

    "Jaweria Shabbir": { phone: "+92 309 8111666" },
    // Variations
    "Jaweria": { phone: "+92 309 8111666" },

    "Mahrukh": { phone: "+92 335 2368507" },

    "Mohammad Salman Ahmed": { phone: "+92 333 1117929" },
    // Variations for Salman
    "Muhammad Salman Ahmad": { phone: "+92 333 1117929" },
    "Salman Ahmad": { phone: "+92 333 1117929" },

    "Muhammad Owais": { phone: "+92 315 3510695" },
    // Variations for Owais
    "Muhammad Owais Chandio": { phone: "+92 315 3510695" },
    "Owais Chandio": { phone: "+92 315 3510695" },

    "Saad Mirza": { phone: "+92 333 0506096" },
    // Variations for Saad
    "Mirza Saad Iftikhar": { phone: "+92 333 0506096" },

    "Shakir Ullah Shakir": { phone: "+92 343 9772277" },
    // Variations for Shakir
    "Shakirullah": { phone: "+92 343 9772277" },

    "Suleman Butt": { phone: "+92 340 1221870" },
    // Variations for Suleman
    "Muhammad Suleman Butt": { phone: "+92 340 1221870" },

    "Syed Tabish": { phone: "+92 335 2229241" },
    // Variations for Tabish
    "Syed Tabish Khaqan": { phone: "+92 335 2229241" },
    "Tabish Khaqan": { phone: "+92 335 2229241" },
};

export const normalizeMemberName = (name: string): string => {
    // Helper to find key if exact match fails? 
    // For now, relies on explicit mapping above.
    return name.trim();
}

export const getContactInfo = (name: string): ContactInfo | undefined => {
    const trimmed = name.trim();
    if (memberContacts[trimmed]) return memberContacts[trimmed];

    // Try minimal fuzzy match if needed, e.g. checking if part of name exists
    // But explicit mapping is safer.
    return undefined;
}
