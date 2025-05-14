import { db } from '@/db';
import { categories } from '@/db/schema';

export const categoryNames = [
    'Cars and vechicles',
    'Comedy',
    'Education',
    'Gaming',
    'Entertainment',
    'Film and animation',
    'How-to style',
    'Music',
    'News and politics',
    'People and blogs',
    'Pets and animals',
    'Science and technology',
    'Sports',
    'Travel and events',
];

async function main() {
    console.log('Seeding Categories...');
    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `Videos Related to ${name.toLowerCase()}`,
        }));
        await db.insert(categories).values(values);
    } catch (error) {
        console.log('Error seeding categories', error);
        process.exit(1);
    }
}

main();
