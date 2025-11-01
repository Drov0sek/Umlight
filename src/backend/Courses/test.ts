import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

async function test() {
    try {
        // 1. Проверим структуру модели
        const sample = await prisma.materials.findFirst();
        console.log('Sample record:', sample);

        // 2. Попробуем выбрать конкретные поля
        const withSelect = await prisma.materials.findFirst({
            select: {
                id: true,
                material: true,
                materialName: true
            }
        });
        console.log('With select:', withSelect);

        // 3. Проверим все доступные поля
        const allFields = await prisma.materials.findFirst({});
        console.log('All fields:', Object.keys(allFields || {}));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

test();