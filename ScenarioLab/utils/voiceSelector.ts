// Automatically select appropriate voice based on scenario details
export function selectVoiceForScenario(aiRole: string, situation: string): string {
    const roleAndSituation = `${aiRole} ${situation}`.toLowerCase();

    // Keywords that suggest female voice
    const femaleKeywords = [
        'woman', 'female', 'lady', 'girl', 'mother', 'mom', 'sister', 'daughter',
        'grandmother', 'aunt', 'wife', 'girlfriend', 'nurse', 'teacher', 'receptionist',
        'hostess', 'waitress', 'secretary', 'assistant', 'saleswoman', 'she', 'her'
    ];

    // Keywords that suggest male voice
    const maleKeywords = [
        'man', 'male', 'guy', 'boy', 'father', 'dad', 'brother', 'son',
        'grandfather', 'uncle', 'husband', 'boyfriend', 'doctor', 'manager', 'boss',
        'waiter', 'salesman', 'representative', 'officer', 'he', 'him', 'his'
    ];

    // Count female indicators
    const femaleCount = femaleKeywords.filter(keyword =>
        roleAndSituation.includes(keyword)
    ).length;

    // Count male indicators
    const maleCount = maleKeywords.filter(keyword =>
        roleAndSituation.includes(keyword)
    ).length;

    // Available voices
    const femaleVoices = [
        'en-US-AvaMultilingualNeural',
        'en-US-EmmaMultilingualNeural',
    ];

    const maleVoices = [
        'en-US-AndrewMultilingualNeural',
        'en-US-BrianMultilingualNeural',
    ];

    // If more female indicators, choose female voice
    if (femaleCount > maleCount) {
        return femaleVoices[Math.floor(Math.random() * femaleVoices.length)];
    }

    // If more male indicators, choose male voice
    if (maleCount > femaleCount) {
        return maleVoices[Math.floor(Math.random() * maleVoices.length)];
    }

    // Default: randomly choose from all voices (if no clear indicator)
    const allVoices = [...femaleVoices, ...maleVoices];
    return allVoices[Math.floor(Math.random() * allVoices.length)];
}
