import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { DetailPanel, PageHeader, StatStrip, formatCurrency, formatDate } from '../components/PageHeader';
import { invoicesApi } from '../services/api';
import { Invoice } from '../types';
import { Box, CircularProgress, Typography, Link, Grid, TableRow, TableCell } from '@mui/material';

export const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      try {
        const invoiceData = await invoicesApi.getById(Number(id));
        setInvoice(invoiceData);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box p={4}>
        <Typography variant="h4">Invoice not found</Typography>
      </Box>
    );
  }

  const customerName = invoice.customer
    ? `${invoice.customer.first_name} ${invoice.customer.last_name}`
    : 'Unknown customer';

  const lineColumns = [
    { id: 'track_name', label: 'Track', minWidth: 250 },
    {
      id: 'unit_price',
      label: 'Unit price',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number | string) => formatCurrency(value),
    },
    { id: 'quantity', label: 'Qty', minWidth: 60, align: 'right' as const },
    {
      id: 'line_total',
      label: 'Line total',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number) => formatCurrency(value),
    },
  ];

  const lines = (invoice.invoice_lines ?? []).map((line) => ({
    ...line,
    id: line.invoice_line_id,
    track_name: line.track?.name || `Track ${line.track_id}`,
    line_total: Number(line.unit_price) * line.quantity,
  }));

  const cityLine = [invoice.billing_city, invoice.billing_state].filter(Boolean).join(', ');
  const countryLine = [invoice.billing_country, invoice.billing_postal_code].filter(Boolean).join(' ');

  return (
    <Box>
      <PageHeader
        title={`Invoice #${invoice.invoice_id}`}
        subtitle={`${customerName}, ${formatDate(invoice.invoice_date)}`}
        crumbs={[
          { label: 'Customers', to: '/customers' },
          ...(invoice.customer_id ? [{ label: customerName, to: `/customers/${invoice.customer_id}` }] : []),
          { label: `Invoice #${invoice.invoice_id}` },
        ]}
        actions={<StatStrip stats={[{ label: 'Total', value: formatCurrency(invoice.total) }]} />}
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <DetailPanel
            title="Invoice"
            rows={[
              { label: 'Date', value: formatDate(invoice.invoice_date) },
              {
                label: 'Customer',
                value: invoice.customer_id ? (
                  <Link component={RouterLink} to={`/customers/${invoice.customer_id}`}>
                    {customerName}
                  </Link>
                ) : (
                  customerName
                ),
              },
              { label: 'Items', value: lines.length },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailPanel
            title="Billing address"
            rows={[
              { label: 'Street', value: invoice.billing_address },
              { label: 'City', value: cityLine },
              { label: 'Country', value: countryLine },
            ]}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Line items
      </Typography>
      <EntityList
        columns={lineColumns}
        data={lines}
        searchable={false}
        emptyMessage="No line items found for this invoice."
        footer={
          <TableRow>
            <TableCell colSpan={3} align="right">
              Total
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              {formatCurrency(invoice.total)}
            </TableCell>
          </TableRow>
        }
      />
    </Box>
  );
};
