import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { customersApi, invoicesApi } from '../services/api';
import { Customer, Invoice } from '../types';
import { DetailPanel, PageHeader, StatStrip, formatCurrency, formatDate } from '../components/PageHeader';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [customerData, invoicesData] = await Promise.all([
          customersApi.getById(Number(id)),
          invoicesApi.getAll(0, 1000, Number(id)),
        ]);
        setCustomer(customerData);
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box p={4}>
        <Typography variant="h4">Customer not found</Typography>
      </Box>
    );
  }

  const totalSpent = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
  const fullName = `${customer.first_name} ${customer.last_name}`;

  const invoiceColumns = [
    { id: 'invoice_id', label: 'Invoice', minWidth: 90, format: (value: number) => `#${value}` },
    {
      id: 'invoice_date',
      label: 'Date',
      minWidth: 120,
      format: (value: string) => formatDate(value),
    },
    { id: 'billing_city', label: 'Billing city', minWidth: 150 },
    { id: 'billing_country', label: 'Billing country', minWidth: 120 },
    {
      id: 'total',
      label: 'Total',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number | string) => formatCurrency(value),
    },
  ];

  const cityLine = [customer.city, customer.state].filter(Boolean).join(', ');
  const countryLine = [customer.country, customer.postal_code].filter(Boolean).join(' ');

  return (
    <Box>
      <PageHeader
        title={fullName}
        subtitle={customer.company || undefined}
        crumbs={[{ label: 'Customers', to: '/customers' }, { label: fullName }]}
        actions={
          <StatStrip
            stats={[
              { label: 'Invoices', value: invoices.length },
              { label: 'Total spent', value: formatCurrency(totalSpent) },
            ]}
          />
        }
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <DetailPanel
            title="Contact"
            rows={[
              { label: 'Email', value: customer.email },
              { label: 'Phone', value: customer.phone },
              { label: 'Fax', value: customer.fax },
              { label: 'Support rep', value: customer.support_rep && `${customer.support_rep.first_name} ${customer.support_rep.last_name}` },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailPanel
            title="Address"
            rows={[
              { label: 'Street', value: customer.address },
              { label: 'City', value: cityLine },
              { label: 'Country', value: countryLine },
            ]}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Purchase history
      </Typography>
      <EntityList
        columns={invoiceColumns}
        data={invoices.map((i) => ({ ...i, id: i.invoice_id }))}
        onRowClick={(invoiceId) => navigate(`/invoices/${invoiceId}`)}
        defaultSort={{ column: 'invoice_date', direction: 'desc' }}
        searchable={false}
        emptyMessage="This customer hasn't made any purchases."
      />
    </Box>
  );
};
