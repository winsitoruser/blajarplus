-- Add Course/Service models to database
-- Run this after adding models to schema.prisma

-- Create enums
CREATE TYPE "CourseLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'all_levels');
CREATE TYPE "CourseTierType" AS ENUM ('basic', 'standard', 'premium', 'custom');
CREATE TYPE "PackageType" AS ENUM ('single_session', 'package_5', 'package_10', 'package_20', 'monthly', 'custom');

-- Create courses table
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "short_description" TEXT,
    "thumbnail_url" TEXT,
    "cover_image_url" TEXT,
    "category" TEXT,
    "level" "CourseLevel" NOT NULL DEFAULT 'all_levels',
    "language" TEXT NOT NULL DEFAULT 'Indonesian',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "total_students" INTEGER NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(3,2),
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- Create course_tiers table
CREATE TABLE "course_tiers" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CourseTierType" NOT NULL DEFAULT 'custom',
    "description" TEXT,
    "features" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "discount_price" DECIMAL(10,2),
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_tiers_pkey" PRIMARY KEY ("id")
);

-- Create course_packages table
CREATE TABLE "course_packages" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "tier_id" TEXT,
    "name" TEXT NOT NULL,
    "type" "PackageType" NOT NULL DEFAULT 'custom',
    "description" TEXT,
    "sessions_included" INTEGER NOT NULL,
    "duration_days" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "discount_price" DECIMAL(10,2),
    "discount_percent" INTEGER,
    "features" TEXT[],
    "is_free_trial_available" BOOLEAN NOT NULL DEFAULT false,
    "free_trial_sessions" INTEGER,
    "free_trial_duration" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_packages_pkey" PRIMARY KEY ("id")
);

-- Create course_images table
CREATE TABLE "course_images" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_images_pkey" PRIMARY KEY ("id")
);

-- Create package_purchases table
CREATE TABLE "package_purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "sessions_total" INTEGER NOT NULL,
    "sessions_used" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "package_purchases_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- Create indexes
CREATE INDEX "courses_tutor_id_idx" ON "courses"("tutor_id");
CREATE INDEX "courses_slug_idx" ON "courses"("slug");
CREATE INDEX "courses_is_active_idx" ON "courses"("is_active");
CREATE INDEX "courses_category_idx" ON "courses"("category");
CREATE INDEX "courses_level_idx" ON "courses"("level");

CREATE INDEX "course_tiers_course_id_idx" ON "course_tiers"("course_id");
CREATE INDEX "course_tiers_type_idx" ON "course_tiers"("type");

CREATE INDEX "course_packages_course_id_idx" ON "course_packages"("course_id");
CREATE INDEX "course_packages_tier_id_idx" ON "course_packages"("tier_id");
CREATE INDEX "course_packages_type_idx" ON "course_packages"("type");

CREATE INDEX "course_images_course_id_idx" ON "course_images"("course_id");

CREATE INDEX "package_purchases_user_id_idx" ON "package_purchases"("user_id");
CREATE INDEX "package_purchases_package_id_idx" ON "package_purchases"("package_id");
CREATE INDEX "package_purchases_status_idx" ON "package_purchases"("status");

-- Add foreign keys
ALTER TABLE "courses" ADD CONSTRAINT "courses_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "course_tiers" ADD CONSTRAINT "course_tiers_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "course_packages" ADD CONSTRAINT "course_packages_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_packages" ADD CONSTRAINT "course_packages_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "course_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "course_images" ADD CONSTRAINT "course_images_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "package_purchases" ADD CONSTRAINT "package_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "package_purchases" ADD CONSTRAINT "package_purchases_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "course_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
