const sqlite = require('sqlite3');

module.exports = (databasePath, toc, callback) => {
	const db = new sqlite.Database(databasePath);

	db.serialize(() => {
		db.run('DROP TABLE IF EXISTS searchIndex');
		db.run('CREATE TABLE IF NOT EXISTS searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)');
		db.run('CREATE UNIQUE INDEX IF NOT EXISTS anchor ON searchIndex (name, type, path)');

		const addItem = db.prepare(
			`INSERT INTO searchIndex(name, type, path)
			VALUES (?, ?, ?)`
		);

		Object.keys(toc).forEach(methodType => {
			Object.keys(toc[methodType]).forEach(method => {
				addItem.run(
					method,
					methodType,
					['index.html', toc[methodType][method]].join('')
				);
			});
		});

		addItem.finalize();
	});

	db.close();

	callback();
};