import prisma from '../config/prisma.js';
import { ScanService } from './scan.service.js';

const mockSeedLogs = [
  {
    id: 'LOG-8842',
    timestamp: '2026-08-18 02:45:12',
    appSource: 'Discord',
    contentType: 'Direct Message',
    status: 'Blocked',
    threatCategory: 'PII / Location Harvesting',
    severity: 'High',
    flaggedContent: 'Hey buddy, what street do you live on? My dad works at your school, I can drop off free V-Bucks cards!',
    aiExplanation: 'The AI detected an unfamiliar contact asking for physical home address details linked with suspicious gift card incentives.',
    childFriendlyExplanation: '🛡️ "Hey there! We paused this message because sharing your real home address or school with people online isn\'t safe. Real friends will never ask you to meet up secretly for game codes! Keep your private details locked."'
  },
  {
    id: 'LOG-8841',
    timestamp: '2026-08-18 01:14:05',
    appSource: 'Roblox',
    contentType: 'In-Game Chat',
    status: 'Blocked',
    threatCategory: 'Phishing URL / Credential Theft',
    severity: 'Critical',
    flaggedContent: 'Go to http://free-robux-generator-2026-login.xyz to claim 100,000 Robux instantly! Just type your password.',
    aiExplanation: 'Malicious phishing link masquerading as a legitimate gaming rewards site designed to hijack child accounts.',
    childFriendlyExplanation: '⚠️ "Hold on! That link leads to a fake website trying to steal your Roblox password. There is no such thing as free Robux generators. We blocked the link so your account stays 100% safe!"'
  },
  {
    id: 'LOG-8838',
    timestamp: '2026-08-17 18:22:11',
    appSource: 'Google Chrome',
    contentType: 'Web Page',
    status: 'Allowed',
    threatCategory: 'Safe Browsing Verified',
    severity: 'Low',
    flaggedContent: 'Visited: https://kids.nationalgeographic.com/animals/mammals/facts/polar-bear',
    aiExplanation: 'Educational biology resource verified clean across Google Safe Browsing and Content Verifier engines.',
    childFriendlyExplanation: '✅ "Verified safe and educational! Have fun learning about polar bears."'
  }
];

let inMemorySettings = {
  strictness: 'MEDIUM',
  safeBrowsingEnabled: true,
  aiModerationEnabled: true,
  onDevicePrivacyOnly: false,
  autoBlockNewContacts: true,
  instantParentAlerts: true,
};

export class DashboardService {
  static async getSummary(childUserId) {
    const dynamicLogs = ScanService.getMemoryLogs();
    const dynamicBlocked = dynamicLogs.filter(l => l.status === 'BLOCKED').length;

    return {
      threatsBlockedWeekly: 42 + dynamicBlocked,
      contentFilteredWeekly: 128 + dynamicLogs.length,
      safeHoursLogged: 36.5,
      digitalCitizenshipScore: 94,
      digitalPet: {
        petName: 'VIPER-007',
        petLevel: 4,
        currentXp: 780,
        xpToNextLevel: 1000,
        safetyScore: 96,
        safetyStreakDays: 14,
      },
    };
  }

  static async getLogs({ childUserId, status, limit = 20, page = 1 }) {
    const dynamicLogs = ScanService.getMemoryLogs();
    const all = [...dynamicLogs, ...mockSeedLogs];

    const filtered = all.filter((l) => {
      if (!status || status.toLowerCase() === 'all') return true;
      if (status.toLowerCase() === 'blocked' || status.toLowerCase() === 'blocked only') {
        return l.status.toLowerCase() === 'blocked';
      }
      if (status.toLowerCase() === 'allowed') {
        return l.status.toLowerCase() === 'allowed';
      }
      return true;
    });

    return {
      pagination: {
        total: filtered.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: 1,
      },
      logs: filtered,
    };
  }

  static async updateSettings(childUserId, updateData) {
    inMemorySettings = { ...inMemorySettings, ...updateData };
    return inMemorySettings;
  }
}
