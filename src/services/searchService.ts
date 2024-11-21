
// Mock intakes data
const mockIntakes = [
  {
    id: 'INT-001',
    title: 'Alemitu Barbara - Initial Consultation',
    description: 'Initial consultation for seasonal allergies',
    date: '2024-03-10',
  },
  {
    id: 'INT-002',
    title: 'Emma Thompson - Follow-up',
    description: 'Follow-up consultation for prescription renewal',
    date: '2024-03-12',
  },
];

export const searchService = {
  search: async (query: string): Promise<SearchResult[]> => {
    // Normalize query
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return [];

    try {
      // Try to fetch from API first
      if (API_URL) {
        try {
          const response = await axios.get(`${API_URL}/search`, {
            params: { q: query },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data;
          }
        } catch (error) {
          console.log('API search failed, falling back to mock data');
        }
      }

      // Fall back to mock data
      const results: SearchResult[] = [];

      // Search medical records
      mockMedicalRecords.forEach(record => {
        if (
          record.patientName.toLowerCase().includes(normalizedQuery) ||
          record.diagnosis?.toLowerCase().includes(normalizedQuery) ||
          record.bloodType.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            id: record.id,
            title: record.patientName,
            type: 'medical_record',
            description: `Diagnosis: ${record.diagnosis}`,
            date: record.lastVisit,
          });
        }
      });

      // Search announcements
      mockAnnouncements.forEach(announcement => {
        if (
          announcement.title.toLowerCase().includes(normalizedQuery) ||
          announcement.description.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            id: announcement.id,
            title: announcement.title,
            type: 'announcement',
            description: announcement.description,
            date: announcement.date,
          });
        }
      });

      // Search intakes
      mockIntakes.forEach(intake => {
        if (
          intake.title.toLowerCase().includes(normalizedQuery) ||
          intake.description.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            id: intake.id,
            title: intake.title,
            type: 'intake',
            description: intake.description,
            date: intake.date,
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },
};
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },
};
