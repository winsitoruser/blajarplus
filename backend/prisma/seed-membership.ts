import { PrismaClient, MembershipTier } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMembership() {
  console.log('🌱 Seeding membership plans...');

  // Create membership plans
  const plans = [
    {
      name: 'Basic (Free)',
      tier: MembershipTier.BASIC,
      maxClasses: 1,
      price: 0,
      currency: 'IDR',
      durationDays: 365, // 1 year free
      features: [
        'Create 1 class',
        'Basic analytics',
        'Email support',
        'Standard visibility',
      ],
      isActive: true,
    },
    {
      name: 'Silver',
      tier: MembershipTier.SILVER,
      maxClasses: 3, // 1 basic + 2 additional
      price: 99000,
      currency: 'IDR',
      durationDays: 30,
      features: [
        'Create up to 3 classes',
        'Advanced analytics',
        'Priority support',
        'Enhanced visibility',
        'Custom class scheduling',
        'Student progress tracking',
      ],
      isActive: true,
    },
    {
      name: 'Gold',
      tier: MembershipTier.GOLD,
      maxClasses: 8, // 1 basic + 2 silver + 5 additional
      price: 199000,
      currency: 'IDR',
      durationDays: 30,
      features: [
        'Create up to 8 classes',
        'Premium analytics',
        'Priority 24/7 support',
        'Maximum visibility',
        'Custom class scheduling',
        'Student progress tracking',
        'Marketing tools',
        'Featured tutor badge',
        'Revenue insights',
      ],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { tier: plan.tier },
      update: {
        name: plan.name,
        maxClasses: plan.maxClasses,
        price: plan.price,
        currency: plan.currency,
        durationDays: plan.durationDays,
        features: plan.features,
        isActive: plan.isActive,
      },
      create: plan,
    });
    console.log(`✅ Created/Updated ${plan.name} plan`);
  }

  console.log('✅ Membership plans seeded successfully!');
}

seedMembership()
  .catch((e) => {
    console.error('❌ Error seeding membership:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
