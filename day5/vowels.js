function wordsWithVowels(str) {
    const words = str.split(/\W+/);

    console.log("Words with at least one vowel:");
    for (let word of words) {
        if (/[aeiouAEIOU]/.test(word)) {
            console.log(word);
        }
    }
}

function groupPureVowelWords(str) {
    const words = str.toLowerCase().split(/\W+/);

    const groups = {
        a: [],
        e: [],
        i: [],
        o: [],
        u: []
    };

    for (let word of words) {
        if (!word) continue; 
        let matches = word.match(/[aeiou]/g);

        if (!matches) continue; 

        let uniqueVowels = new Set(matches);

        if (uniqueVowels.size === 1) {
            let vowel = [...uniqueVowels][0];
            groups[vowel].push(word);
        }
    }

    return groups;
}



let input = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.";


wordsWithVowels(input);

console.log("\nGrouped words (same vowel only):");
console.log(groupPureVowelWords(input));
