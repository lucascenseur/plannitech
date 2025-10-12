#!/usr/bin/env tsx

/**
 * Script de test pour valider toutes les API routes
 * Usage: npx tsx scripts/test-api.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration de test
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_ORGANIZATION_ID = 'test-org-123';
const TEST_USER_ID = 'test-user-123';

// Données de test
const testData = {
  project: {
    title: 'Test Spectacle',
    description: 'Description du test',
    type: 'SPECTACLE',
    startDate: new Date(),
    endDate: new Date(),
    budget: 1000,
    currency: 'EUR'
  },
  venue: {
    name: 'Test Venue',
    type: 'Theater',
    address: '123 Test Street',
    capacity: 500,
    status: 'AVAILABLE',
    contactName: 'Test Contact',
    contactPhone: '0123456789',
    contactEmail: 'test@venue.com'
  },
  contact: {
    name: 'Test Contact',
    email: 'test@contact.com',
    phone: '0123456789',
    type: 'ARTIST',
    company: 'Test Company',
    role: 'Actor',
    status: 'ACTIVE'
  },
  technicalSheet: {
    title: 'Test Technical Sheet',
    type: 'LIGHTING',
    status: 'DRAFT',
    requirements: { lights: 10 },
    team: { technician: 2 },
    notes: 'Test notes'
  }
};

// Fonction pour faire des requêtes HTTP
async function makeRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: { error: error.message }, ok: false };
  }
}

// Tests des API routes
async function testAPIs() {
  console.log('🧪 Début des tests API...\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: API Health Check
  console.log('1. Test API Health Check...');
  const healthResult = await makeRequest(`${BASE_URL}/api/health`);
  results.total++;
  if (healthResult.ok && healthResult.data.status === 'ok') {
    console.log('✅ Health Check: OK');
    results.passed++;
  } else {
    console.log('❌ Health Check: FAILED', healthResult.data);
    results.failed++;
  }

  // Test 2: API Shows (GET)
  console.log('\n2. Test API Shows (GET)...');
  const showsResult = await makeRequest(`${BASE_URL}/api/shows`);
  results.total++;
  if (showsResult.ok) {
    console.log('✅ Shows GET: OK');
    results.passed++;
  } else {
    console.log('❌ Shows GET: FAILED', showsResult.data);
    results.failed++;
  }

  // Test 3: API Venues (GET)
  console.log('\n3. Test API Venues (GET)...');
  const venuesResult = await makeRequest(`${BASE_URL}/api/venues`);
  results.total++;
  if (venuesResult.ok) {
    console.log('✅ Venues GET: OK');
    results.passed++;
  } else {
    console.log('❌ Venues GET: FAILED', venuesResult.data);
    results.failed++;
  }

  // Test 4: API Contacts (GET)
  console.log('\n4. Test API Contacts (GET)...');
  const contactsResult = await makeRequest(`${BASE_URL}/api/contacts`);
  results.total++;
  if (contactsResult.ok) {
    console.log('✅ Contacts GET: OK');
    results.passed++;
  } else {
    console.log('❌ Contacts GET: FAILED', contactsResult.data);
    results.failed++;
  }

  // Test 5: API Technical Sheets (GET)
  console.log('\n5. Test API Technical Sheets (GET)...');
  const technicalSheetsResult = await makeRequest(`${BASE_URL}/api/technical-sheets`);
  results.total++;
  if (technicalSheetsResult.ok) {
    console.log('✅ Technical Sheets GET: OK');
    results.passed++;
  } else {
    console.log('❌ Technical Sheets GET: FAILED', technicalSheetsResult.data);
    results.failed++;
  }

  // Test 6: API Activities (GET)
  console.log('\n6. Test API Activities (GET)...');
  const activitiesResult = await makeRequest(`${BASE_URL}/api/activities`);
  results.total++;
  if (activitiesResult.ok) {
    console.log('✅ Activities GET: OK');
    results.passed++;
  } else {
    console.log('❌ Activities GET: FAILED', activitiesResult.data);
    results.failed++;
  }

  // Test 7: API Search (GET)
  console.log('\n7. Test API Search (GET)...');
  const searchResult = await makeRequest(`${BASE_URL}/api/search?q=test`);
  results.total++;
  if (searchResult.ok) {
    console.log('✅ Search GET: OK');
    results.passed++;
  } else {
    console.log('❌ Search GET: FAILED', searchResult.data);
    results.failed++;
  }

  // Test 8: API Conflicts (GET)
  console.log('\n8. Test API Conflicts (GET)...');
  const conflictsResult = await makeRequest(`${BASE_URL}/api/conflicts`);
  results.total++;
  if (conflictsResult.ok) {
    console.log('✅ Conflicts GET: OK');
    results.passed++;
  } else {
    console.log('❌ Conflicts GET: FAILED', conflictsResult.data);
    results.failed++;
  }

  // Test 9: API Shows (POST) - Test de création
  console.log('\n9. Test API Shows (POST)...');
  const createShowResult = await makeRequest(`${BASE_URL}/api/shows`, {
    method: 'POST',
    body: JSON.stringify(testData.project)
  });
  results.total++;
  if (createShowResult.ok || createShowResult.status === 401) { // 401 attendu sans authentification
    console.log('✅ Shows POST: OK (401 attendu sans auth)');
    results.passed++;
  } else {
    console.log('❌ Shows POST: FAILED', createShowResult.data);
    results.failed++;
  }

  // Test 10: API Venues (POST) - Test de création
  console.log('\n10. Test API Venues (POST)...');
  const createVenueResult = await makeRequest(`${BASE_URL}/api/venues`, {
    method: 'POST',
    body: JSON.stringify(testData.venue)
  });
  results.total++;
  if (createVenueResult.ok || createVenueResult.status === 401) { // 401 attendu sans authentification
    console.log('✅ Venues POST: OK (401 attendu sans auth)');
    results.passed++;
  } else {
    console.log('❌ Venues POST: FAILED', createVenueResult.data);
    results.failed++;
  }

  // Test 11: API Contacts (POST) - Test de création
  console.log('\n11. Test API Contacts (POST)...');
  const createContactResult = await makeRequest(`${BASE_URL}/api/contacts`, {
    method: 'POST',
    body: JSON.stringify(testData.contact)
  });
  results.total++;
  if (createContactResult.ok || createContactResult.status === 401) { // 401 attendu sans authentification
    console.log('✅ Contacts POST: OK (401 attendu sans auth)');
    results.passed++;
  } else {
    console.log('❌ Contacts POST: FAILED', createContactResult.data);
    results.failed++;
  }

  // Test 12: API Technical Sheets (POST) - Test de création
  console.log('\n12. Test API Technical Sheets (POST)...');
  const createTechnicalSheetResult = await makeRequest(`${BASE_URL}/api/technical-sheets`, {
    method: 'POST',
    body: JSON.stringify(testData.technicalSheet)
  });
  results.total++;
  if (createTechnicalSheetResult.ok || createTechnicalSheetResult.status === 401) { // 401 attendu sans authentification
    console.log('✅ Technical Sheets POST: OK (401 attendu sans auth)');
    results.passed++;
  } else {
    console.log('❌ Technical Sheets POST: FAILED', createTechnicalSheetResult.data);
    results.failed++;
  }

  // Résumé des tests
  console.log('\n📊 Résumé des tests:');
  console.log(`✅ Réussis: ${results.passed}`);
  console.log(`❌ Échoués: ${results.failed}`);
  console.log(`📈 Total: ${results.total}`);
  console.log(`🎯 Taux de réussite: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 Tous les tests sont passés !');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }

  return results;
}

// Fonction pour nettoyer les données de test
async function cleanupTestData() {
  console.log('\n🧹 Nettoyage des données de test...');
  
  try {
    // Supprimer les données de test (si elles existent)
    await prisma.project.deleteMany({
      where: {
        title: { contains: 'Test' }
      }
    });
    
    await prisma.venue.deleteMany({
      where: {
        name: { contains: 'Test' }
      }
    });
    
    await prisma.contact.deleteMany({
      where: {
        name: { contains: 'Test' }
      }
    });
    
    await prisma.technicalSheet.deleteMany({
      where: {
        title: { contains: 'Test' }
      }
    });
    
    console.log('✅ Nettoyage terminé');
  } catch (error) {
    console.log('⚠️  Erreur lors du nettoyage:', error);
  }
}

// Fonction principale
async function main() {
  try {
    console.log('🚀 Démarrage des tests API Plannitech\n');
    
    // Nettoyer d'abord
    await cleanupTestData();
    
    // Exécuter les tests
    const results = await testAPIs();
    
    // Nettoyer après les tests
    await cleanupTestData();
    
    // Fermer la connexion Prisma
    await prisma.$disconnect();
    
    // Code de sortie basé sur les résultats
    process.exit(results.failed === 0 ? 0 : 1);
    
  } catch (error) {
    console.error('💥 Erreur fatale lors des tests:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  main();
}

export { testAPIs, cleanupTestData };
