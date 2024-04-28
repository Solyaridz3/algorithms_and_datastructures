function lengthOfLongestSubstring(s) {
    let current = [];
    let longestLength = 0;
    for (const element of s) {
        if (current.includes(element)) {
            current = current.slice(current.indexOf(element) + 1);
        }
        current.push(element);
        if (longestLength < current.length) {
            longestLength = current.length;
        }
    }
    return longestLength;
}

