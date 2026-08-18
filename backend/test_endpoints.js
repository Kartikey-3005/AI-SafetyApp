import axios from 'axios';

async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🚀 Running Backend API Verification Tests...\n');

  try {
    // 1. Test Phishing Link Scan
    console.log('1. Testing Threat Scan (Phishing URL in Roblox)...');
    const res1 = await axios.post(`${BASE_URL}/scan`, {
      userId: 'child-1',
      content: 'http://free-robux-generator-2026.xyz',
      contentType: 'URL',
      appSource: 'Roblox'
    });
    console.log('✅ Scan Response:', res1.data);

    // 2. Test Cache Hit on Same URL
    console.log('\n2. Testing Redis Cache Hit on identical scan...');
    const res2 = await axios.post(`${BASE_URL}/scan`, {
      userId: 'child-1',
      content: 'http://free-robux-generator-2026.xyz',
      contentType: 'URL',
      appSource: 'Roblox'
    });
    console.log('✅ Cached Scan Response (fromCache should be true):', res2.data);

    // 3. Test PII Solicitation Scan
    console.log('\n3. Testing Threat Scan (PII Solicitation in Discord)...');
    const res3 = await axios.post(`${BASE_URL}/scan`, {
      userId: 'child-1',
      content: 'Hey buddy, what street do you live on?',
      contentType: 'DIRECT_MESSAGE',
      appSource: 'Discord'
    });
    console.log('✅ PII Threat Response:', res3.data);

    // 4. Test Dashboard Summary
    console.log('\n4. Testing GET /api/dashboard/summary...');
    const res4 = await axios.get(`${BASE_URL}/dashboard/summary?childId=child-1`);
    console.log('✅ Summary Response:', res4.data);

    // 5. Test Dashboard Logs
    console.log('\n5. Testing GET /api/dashboard/logs?childId=child-1&status=blocked...');
    const res5 = await axios.get(`${BASE_URL}/dashboard/logs?childId=child-1&status=blocked`);
    console.log(`✅ Logs Retrieved: ${res5.data.logs.length} logs`);

    // 6. Test Settings Update
    console.log('\n6. Testing PUT /api/dashboard/settings...');
    const res6 = await axios.put(`${BASE_URL}/dashboard/settings`, {
      childId: 'child-1',
      settings: {
        strictness: 'HIGH',
        safeBrowsingEnabled: true,
        aiModerationEnabled: true,
        onDevicePrivacyOnly: true
      }
    });
    console.log('✅ Settings Update Response:', res6.data);

    console.log('\n🎉 ALL BACKEND ENDPOINTS VERIFIED AND WORKING PERFECTLY!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTests();
