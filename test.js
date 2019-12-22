import test from 'ava';
import mongoose from 'mongoose';
import mms from 'mongodb-memory-server';
import nm from '.';

test('Main', async t => {
	const mongodb = new mms();
	mongoose.connect(await mongodb.getConnectionString(), {useNewUrlParser: true});

	const personSchema = mongoose.Schema({
		name: String,
		age: Number,
		email: String,
		password: {type: String, private: true}
	});

	personSchema.plugin(nm);

	const Person = mongoose.model('Person', personSchema);

	t.true(personSchema.options.toJSON.transform instanceof Function, 'Check that toJSON.transform is a function');

	const someone = new Person({
		name: 'Abraham',
		age: 7,
		email: 'email@example.com',
		password: 'my_awesome_password'
	});

	someone.save();

	const result = someone.toJSON();

	const expected = {
		age: 7,
		email: 'email@example.com',
		name: 'Abraham'
	};

	t.deepEqual(result, {...expected, id: result.id});
});
