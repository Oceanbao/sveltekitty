import { expect, it } from 'vitest';
import { z } from 'zod';

// Typing API result
const PersonResult = z.object({
	name: z.string(),
	films: z.array(z.string())
});

export const fetchStarWarsPersonName = async (id: string) => {
	const data = await fetch('https://swapi.dev/api/people/' + id).then((res) => res.json());

	const parsedData = PersonResult.parse(data);
	console.log(parsedData);

	return parsedData.name;
};

it('Should return the name', async () => {
	expect(await fetchStarWarsPersonName('1')).toEqual('Luke Skywalker');
	expect(await fetchStarWarsPersonName('2')).toEqual('C-3PO');
});

// Typing form input output
const Form = z.object({
	repoName: z.string(),
	keywords: z.array(z.string()).default([]),
	privacyLevel: z.union([z.literal('private'), z.literal('public')])
});

const validateFormInput = (values: unknown) => {
	const parsedData = Form.parse(values);

	return parsedData;
};

// Special type extraction on input differing from output
// Input's keyword is not parsed as input
type FormInput = z.input<typeof Form>;
type FormOutput = z.infer<typeof Form>;

it('Should include valid privacy level', async () => {
	expect(
		validateFormInput({
			repoName: 'mattpocock',
			privacyLevel: 'private'
		}).privacyLevel
	).toEqual('private');

	expect(
		validateFormInput({
			repoName: 'mattpocock',
			privacyLevel: 'public'
		}).privacyLevel
	).toEqual('public');
});

// Special types
const SpecialForm = z.object({
	name: z.string().min(1),
	phoneNumber: z.string().min(5).max(20).optional(),
	email: z.string().email(),
	website: z.string().url().optional()
});

const validateSpecialForm = (values: unknown) => {
	const parsedData = SpecialForm.parse(values);

	return parsedData;
};

it('Should fail if pass a phone number with too little input', async () => {
	expect(() =>
		validateSpecialForm({
			name: 'Matt',
			email: 'matt@example.com',
			phoneNumber: '1'
		})
	).toThrowError('String must contain at least 5 character(s)');
	// This must literal-match the zod error message
});

// Extend zod object
import type { Expect, Equal } from './type-utils';

const ObjectWithId = z.object({
	id: z.string().uuid()
});

const User = ObjectWithId.extend({
	name: z.string()
});

const Post = ObjectWithId.extend({
	title: z.string(),
	body: z.string()
});

const Comment = ObjectWithId.extend({
	text: z.string()
});

type cases = [
	Expect<Equal<z.infer<typeof Comment>, { id: string; text: string }>>,
	Expect<Equal<z.infer<typeof Post>, { id: string; title: string; body: string }>>,
	Expect<Equal<z.infer<typeof User>, { id: string; name: string }>>
];

// Merge zod object
// const ObjectWithId = z.object({
//   id: z.string().uuid(),
// });

// const User = ObjectWithId.merge(
//   z.object({
//     name: z.string(),
//   }),
// );

// const Post = ObjectWithId.merge(
//   z.object({
//     title: z.string(),
//     body: z.string(),
//   }),
// );

// const Comment = ObjectWithId.merge(
//   z.object({
//     text: z.string(),
//   }),
// );

// type cases = [
//   Expect<Equal<z.infer<typeof Comment>, { id: string; text: string }>>,
//   Expect<
//     Equal<z.infer<typeof Post>, { id: string; title: string; body: string }>
//   >,
//   Expect<Equal<z.infer<typeof User>, { id: string; name: string }>>,
// ];

// Refine - customise error message?
const FormRefine = z
	.object({
		password: z.string(),
		confirmPassword: z.string()
	})
	.refine(
		({ confirmPassword, password }) => {
			return confirmPassword === password;
		},
		{
			path: ['confirmPassword'],
			message: "Passwords don't match"
		}
	);

export const validateFormInputRefine = (values: unknown) => {
	const parsedData = FormRefine.parse(values);

	return parsedData;
};

it('Should error if the passwords are not the same', () => {
	expect(() =>
		validateFormInputRefine({
			password: 'password',
			confirmPassword: 'password1'
		})
	).toThrowError("Passwords don't match");
});

// Refine Async
const doesStarWarsPersonExist = async (id: string) => {
	try {
		const data = await fetch('https://www.totaltypescript.com/swapi/people/' + id + '.json').then(
			(res) => res.json()
		);
		return Boolean(data?.name);
	} catch (e) {
		// Returns false if not found
		return false;
	}
};

const FormAsyncRefine = z.object({
	id: z.string().refine(doesStarWarsPersonExist, 'Not found')
});

export const validateFormInputAsyncRefine = async (values: unknown) => {
	const parsedData = await FormAsyncRefine.parseAsync(values);

	return parsedData;
};

it('Should fail if the star wars person does not exist', async () => {
	await expect(
		validateFormInputAsyncRefine({
			id: '123123123123123123'
		})
	).rejects.toThrow('Not found');
});

it('Should succeed if the star wars person does exist', async () => {
	expect(
		await validateFormInputAsyncRefine({
			id: '1'
		})
	).toEqual({ id: '1' });
});

// Transform
const StarWarsPerson = z
	.object({
		name: z.string()
	})
	.transform((person) => ({
		...person,
		nameAsArray: person.name.split(' ')
	}));

const StarWarsPeopleResults = z.object({
	results: z.array(StarWarsPerson)
});

export const fetchStarWarsPeople = async () => {
	const data = await fetch('https://www.totaltypescript.com/swapi/people.json').then((res) =>
		res.json()
	);

	const parsedData = StarWarsPeopleResults.parse(data);

	return parsedData.results;
};

it('Should resolve the name and nameAsArray', async () => {
	expect((await fetchStarWarsPeople())[0]).toEqual({
		name: 'Luke Skywalker',
		nameAsArray: ['Luke', 'Skywalker']
	});
});

// Lazy - recursive impossible in TS, need to define hint via
// ZodType with lazy()
interface MenuItemType {
	link: string;
	label: string;
	children?: MenuItemType[];
}

const MenuItem: z.ZodType<MenuItemType> = z.lazy(() =>
	z.object({
		link: z.string(),
		label: z.string(),
		children: z.array(MenuItem).default([])
	})
);

it('Should succeed when it encounters a correct structure', async () => {
	const menuItem = {
		link: '/',
		label: 'Home',
		children: [
			{
				link: '/somewhere',
				label: 'Somewhere',
				children: []
			}
		]
	};
	expect(MenuItem.parse(menuItem)).toEqual(menuItem);
});

it('Should error when it encounters an incorrect structure', async () => {
	const menuItem = {
		children: [
			{
				link: '/somewhere',
				label: 'Somewhere',
				children: []
			}
		]
	};
	expect(() => MenuItem.parse(menuItem)).toThrowError();
});

// Generic
const genericFetch = <ZSchema extends z.ZodSchema>(
	url: string,
	schema: ZSchema
): Promise<z.infer<ZSchema>> => {
	return fetch(url)
		.then((res) => res.json())
		.then((result) => schema.parse(result));
};

it('Should fetch from the Star Wars API', async () => {
	const result = await genericFetch(
		'https://www.totaltypescript.com/swapi/people/1.json',
		z.object({
			name: z.string()
		})
	);

	type cases = [
		// Result should equal { name: string }, not any
		Expect<Equal<typeof result, { name: string }>>
	];
});
