import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { customersApi } from '../services/api';
import { Customer } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customersApi.getAll(0, 1000);
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    { id: 'customer_id', label: 'ID', minWidth: 50, width: 80, align: 'right' as const },
    { id: 'first_name', label: 'First name', minWidth: 120 },
    { id: 'last_name', label: 'Last name', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'city', label: 'City', minWidth: 100 },
    { id: 'country', label: 'Country', minWidth: 100 },
  ];

  return (
    <EntityList
      title="Customers"
      subtitle="Select a customer to see their contact details and purchase history."
      columns={columns}
      data={customers.map(c => ({ ...c, id: c.customer_id }))}
      onRowClick={(id) => navigate(`/customers/${id}`)}
      defaultSort={{ column: 'last_name', direction: 'asc' }}
      searchPlaceholder="Search name, email, city or country"
    />
  );
};

