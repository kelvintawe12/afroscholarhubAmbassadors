import React, { useEffect, useState } from 'react';
import { DataTable } from '../../ui/widgets/DataTable';
import { getAllAmbassadors } from '../../../api/ambassador';
import { User } from '../../../utils/supabase';
import { Mail, Phone, MapPin } from 'lucide-react';

export const DirectoryPage = () => {
  const [ambassadors, setAmbassadors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        const data = await getAllAmbassadors();
        setAmbassadors(data);
      } catch (err) {
        setError('Failed to load ambassadors');
        console.error('Error fetching ambassadors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAmbassadors();
  }, []);

  const columns = [
    {
      header: 'Name',
      accessor: 'full_name',
      sortable: true,
    },
    {
      header: 'Email',
      accessor: (row: User) => (
        <div className="flex items-center">
          <Mail size={16} className="mr-2 text-gray-400" />
          <span>{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Country',
      accessor: (row: User) => (
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-gray-400" />
          <span>{row.country_code?.toUpperCase() || 'N/A'}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row: User) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.role === 'ambassador' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          Active
        </span>
      ),
      sortable: false,
    },
    {
      header: 'Joined',
      accessor: (row: User) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ash-teal"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-ash-teal text-white rounded-md hover:bg-ash-teal/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ambassador Directory</h1>
        <p className="text-gray-600">View and manage all ambassadors in the network</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <DataTable
            columns={columns}
            data={ambassadors}
            keyField="id"
            rowsPerPage={10}
            pagination={true}
            showSearch={true}
          />
        </div>
      </div>
    </div>
  );
};
