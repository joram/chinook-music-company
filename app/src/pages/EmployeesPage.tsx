import React, { useEffect, useState } from 'react';
import { EntityList } from '../components/EntityList';
import { employeesApi } from '../services/api';
import { Employee } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeesApi.getAll();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    { id: 'employee_id', label: 'ID', minWidth: 50, width: 80, align: 'right' as const },
    { id: 'first_name', label: 'First name', minWidth: 120 },
    { id: 'last_name', label: 'Last name', minWidth: 120 },
    { id: 'title', label: 'Title', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'city', label: 'City', minWidth: 100 },
  ];

  return (
    <EntityList
      title="Employees"
      subtitle="Staff directory."
      columns={columns}
      data={employees.map(e => ({ ...e, id: e.employee_id }))}
      defaultSort={{ column: 'last_name', direction: 'asc' }}
      searchPlaceholder="Search employees"
    />
  );
};

