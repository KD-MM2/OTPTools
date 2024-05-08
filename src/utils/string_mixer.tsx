export { mixCharacters, unmixCharacters };

function mixCharacters(str: string): string {
	const evenIndices: string[] = [];
	const oddIndices: string[] = [];

	// Split the string into even and odd indices
	for (let i = 0; i < str.length; i++) {
		if (i % 2 === 0) {
			evenIndices.push(str[i]);
		} else {
			oddIndices.push(str[i]);
		}
	}

	// Reverse the arrays
	evenIndices.reverse();
	oddIndices.reverse();

	let mixedStr = "";
	let evenIndex = 0;
	let oddIndex = 0;

	// Alternate characters from the reversed arrays
	for (let i = 0; i < str.length; i++) {
		if (i % 2 === 0) {
			mixedStr += evenIndices[evenIndex];
			evenIndex++;
		} else {
			mixedStr += oddIndices[oddIndex];
			oddIndex++;
		}
	}

	return mixedStr;
}

function unmixCharacters(mixedStr: string): string {
	const length = mixedStr.length;
	const evenIndices: string[] = [];
	const oddIndices: string[] = [];

	// Split the mixed string into even and odd indices
	for (let i = 0; i < length; i++) {
		if (i % 2 === 0) {
			evenIndices.push(mixedStr[i]);
		} else {
			oddIndices.push(mixedStr[i]);
		}
	}

	// Reverse the arrays
	evenIndices.reverse();
	oddIndices.reverse();

	let unmixedStr = "";
	let evenIndex = 0;
	let oddIndex = 0;

	// Interleave characters from the reversed arrays
	for (let i = 0; i < length; i++) {
		if (i % 2 === 0) {
			unmixedStr += evenIndices[evenIndex];
			evenIndex++;
		} else {
			unmixedStr += oddIndices[oddIndex];
			oddIndex++;
		}
	}

	return unmixedStr;
}
