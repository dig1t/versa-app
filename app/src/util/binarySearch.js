export const binarySearch = (array, value) => {
	let min = 0
	let max = array.length - 1

	while (min <= max) {
		const mid = (min + max) >> 1

		if (array[mid] === value) {
			return mid
		} else if (array[mid] < value) {
			min = mid + 1
		} else {
			max = mid -1
		}
	}

	return -1
}

export const binarySearchArrayChild = (array, key, value) => {
	let min = 0
	let max = array.length - 1

	while (min <= max) {
		const mid = (min + max) >> 1

		if (array[mid][key] === value) {
			return mid
		} else if (array[mid].key < value) {
			min = mid + 1
		} else {
			max = mid -1
		}
	}

	return -1
}
