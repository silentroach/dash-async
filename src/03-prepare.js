module.exports = data => {
	// adding close tag for links to avoid commonmarks renderer problems
	return data.replace(
		/<a\ name=\"(.*?)\"\ ?\/?>/g,
		`<a name="$1"></a>`
	)
};