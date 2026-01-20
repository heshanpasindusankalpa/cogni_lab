import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Starting seed...');

  // First, check if we have any users to use as instructors
  let instructor = await prisma.user.findFirst({
    where: { userType: 'INSTRUCTOR' },
  });

  // If no instructor exists, create a placeholder one
  if (!instructor) {
    instructor = await prisma.user.findFirst();
  }

  if (!instructor) {
    console.log('⚠️  No users found. Creating a placeholder user...');
    instructor = await prisma.user.create({
      data: {
        clerkUserId: 'seed_user_001',
        email: 'instructor@cognilab.com',
        fullName: 'Seed Instructor',
        userType: 'INSTRUCTOR',
        university: 'CogniLab University',
      },
    });
  }

  console.log(`📚 Using instructor: ${instructor.fullName} (${instructor.id})`);

  // Seed modules
  const modules = [
    {
      moduleName: 'Electronics Fundamentals',
      description:
        'Basic electronics concepts including resistors, capacitors, inductors, and basic circuit analysis.',
      moduleCode: 'EE101',
    },
    {
      moduleName: 'Digital Electronics',
      description:
        'Introduction to digital logic, gates, flip-flops, and combinational circuits.',
      moduleCode: 'EE201',
    },
    {
      moduleName: 'Power Systems',
      description:
        'Study of power generation, transmission, distribution, and power electronics.',
      moduleCode: 'EE301',
    },
    {
      moduleName: 'Control Systems',
      description:
        'Analysis and design of control systems, feedback mechanisms, and stability analysis.',
      moduleCode: 'EE302',
    },
    {
      moduleName: 'Measurements & Instrumentation',
      description:
        'Electronic measurement techniques, oscilloscopes, multimeters, and signal analyzers.',
      moduleCode: 'EE203',
    },
    {
      moduleName: 'Circuit Analysis Lab',
      description:
        'Practical laboratory experiments for circuit analysis and design.',
      moduleCode: 'EE102L',
    },
    {
      moduleName: 'Analog Electronics',
      description:
        'Operational amplifiers, filters, oscillators, and analog signal processing.',
      moduleCode: 'EE202',
    },
    {
      moduleName: 'Renewable Energy Systems',
      description:
        'Solar, wind, and other renewable energy technologies and their integration.',
      moduleCode: 'EE401',
    },
  ];

  for (const moduleData of modules) {
    const existing = await prisma.module.findFirst({
      where: { moduleCode: moduleData.moduleCode },
    });

    if (!existing) {
      await prisma.module.create({
        data: {
          ...moduleData,
          instructorId: instructor.id,
        },
      });
      console.log(`✅ Created module: ${moduleData.moduleName}`);
    } else {
      console.log(`⏭️  Module already exists: ${moduleData.moduleName}`);
    }
  }

  // Seed some lab equipment if none exists
  const equipmentCount = await prisma.labEquipment.count();

  if (equipmentCount === 0) {
    const equipments = [
      {
        equipmentType: 'Electronic',
        equipmentName: 'Oscilloscope',
        description:
          'An oscilloscope is an electronic diagnostic tool that visualizes electrical signals by plotting voltage against time.',
        supportsConfiguration: true,
        defaultConfigJson: {
          timebase: '1ms/div',
          voltage: '1V/div',
          coupling: 'DC',
          trigger: 'Auto',
        },
      },
      {
        equipmentType: 'Electronic',
        equipmentName: 'Function Generator',
        description:
          'Generates various waveforms including sine, square, triangle, and sawtooth waves.',
        supportsConfiguration: true,
        defaultConfigJson: {
          frequency: 1000,
          amplitude: 5,
          dcOffset: 0,
          waveform: 'Sine',
        },
      },
      {
        equipmentType: 'Electronic',
        equipmentName: 'Digital Multimeter',
        description:
          'Measures voltage, current, and resistance with high precision.',
        supportsConfiguration: true,
        defaultConfigJson: {
          mode: 'Voltage',
          range: 'Auto',
          unit: 'V',
        },
      },
      {
        equipmentType: 'Component',
        equipmentName: 'Resistor',
        description: 'A passive electrical component that provides resistance.',
        supportsConfiguration: true,
        defaultConfigJson: {
          resistance: 1000,
          unit: 'Ω',
          tolerance: '5%',
        },
      },
      {
        equipmentType: 'Component',
        equipmentName: 'Capacitor',
        description:
          'A passive electrical component that stores electrical energy.',
        supportsConfiguration: true,
        defaultConfigJson: {
          capacitance: 100,
          unit: 'µF',
          voltage: '50V',
        },
      },
      {
        equipmentType: 'Component',
        equipmentName: 'LED',
        description: 'Light Emitting Diode - a semiconductor light source.',
        supportsConfiguration: true,
        defaultConfigJson: {
          color: 'Red',
          forwardVoltage: 2.0,
          maxCurrent: 20,
        },
      },
      {
        equipmentType: 'Power',
        equipmentName: 'DC Power Supply',
        description: 'Provides regulated DC voltage for circuits.',
        supportsConfiguration: true,
        defaultConfigJson: {
          voltage: 12,
          currentLimit: 1,
          unit: 'V',
        },
      },
    ];

    for (const eq of equipments) {
      await prisma.labEquipment.create({
        data: {
          ...eq,
          creatorId: instructor.id,
        },
      });
      console.log(`✅ Created equipment: ${eq.equipmentName}`);
    }
  }

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
