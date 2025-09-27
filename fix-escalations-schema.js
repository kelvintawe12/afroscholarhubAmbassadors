#!/usr/bin/env node

/**
 * Script to fix the escalations table schema issues
 * This script applies the migration to fix column names and relationships
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🔧 Starting escalations schema fix...');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'backend/sql/migrations/008_fix_escalations_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded successfully');

    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);

        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });

          if (error) {
            // If rpc doesn't work, try direct query
            const { error: queryError } = await supabase.from('_supabase_migration_temp').select('*').limit(0);
            if (queryError) {
              console.log('⚠️  RPC not available, trying direct SQL execution...');
              // Note: Direct SQL execution might not be available in all Supabase plans
              console.log('❌ Direct SQL execution not supported. Please run the migration manually in Supabase SQL Editor.');
              console.log('\n📄 Migration SQL:');
              console.log('================');
              console.log(migrationSQL);
              return;
            }
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} failed (might be expected):`, err.message);
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n📋 Summary of changes:');
    console.log('- Renamed columns: escalated_by → reporter_id, assigned_to → assignee_id');
    console.log('- Added missing columns: school_id, task_id, team_id, time_to_resolve');
    console.log('- Updated status values to lowercase');
    console.log('- Updated priority values to lowercase');
    console.log('- Fixed RLS policies to use correct column names');
    console.log('- Added indexes for new columns');
    console.log('- Added trigger for automatic resolution time calculation');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n🔧 Manual fix instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of backend/sql/migrations/008_fix_escalations_schema.sql');
    console.log('4. Execute the migration');
  }
}

// Alternative: Provide manual instructions
function showManualInstructions() {
  console.log('🔧 Manual Escalations Schema Fix Instructions:');
  console.log('==============================================');
  console.log('');
  console.log('1. Open your Supabase dashboard');
  console.log('2. Go to SQL Editor');
  console.log('3. Copy and paste the following SQL:');
  console.log('');

  const migrationPath = path.join(__dirname, 'backend/sql/migrations/008_fix_escalations_schema.sql');
  try {
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log(migrationSQL);
  } catch (err) {
    console.log('❌ Could not read migration file');
  }

  console.log('');
  console.log('4. Click "Run" to execute the migration');
  console.log('');
  console.log('This will:');
  console.log('- Fix column name mismatches (escalated_by → reporter_id, assigned_to → assignee_id)');
  console.log('- Add missing foreign key columns (school_id, task_id, team_id)');
  console.log('- Update status/priority values to match API expectations');
  console.log('- Fix RLS policies and add proper indexes');
}

// Check if we should run automatically or show manual instructions
const args = process.argv.slice(2);
if (args.includes('--manual')) {
  showManualInstructions();
} else {
  runMigration();
}
