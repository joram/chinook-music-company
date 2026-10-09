import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Search } from '@mui/icons-material';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: any) => React.ReactNode;
  // Value used for sorting and searching when the raw field isn't suitable
  sortValue?: (row: any) => string | number | null | undefined;
  sortable?: boolean;
}

interface EntityListProps {
  title?: string;
  subtitle?: React.ReactNode;
  columns: Column[];
  data: any[];
  onRowClick?: (id: number) => void;
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  footer?: React.ReactNode;
  emptyMessage?: string;
}

type Direction = 'asc' | 'desc';

const getValue = (row: any, column: Column) =>
  column.sortValue ? column.sortValue(row) : row[column.id];

const compareValues = (a: unknown, b: unknown): number => {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;

  // API returns decimals as strings, so compare numerically when both parse
  const aNum = typeof a === 'number' ? a : Number(a);
  const bNum = typeof b === 'number' ? b : Number(b);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;

  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base', numeric: true });
};

export const EntityList: React.FC<EntityListProps> = ({
  title,
  subtitle,
  columns,
  data,
  onRowClick,
  defaultSort,
  searchable = true,
  searchPlaceholder = 'Search',
  pageSize = 25,
  footer,
  emptyMessage = 'Nothing here yet.',
}) => {
  const [orderBy, setOrderBy] = useState<string | undefined>(defaultSort?.column);
  const [direction, setDirection] = useState<Direction>(defaultSort?.direction ?? 'asc');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const rowId = (row: any) => (row.id ?? Object.values(row)[0]) as number;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      columns.some((column) => {
        const value = getValue(row, column);
        return value !== null && value !== undefined && String(value).toLowerCase().includes(q);
      })
    );
  }, [data, columns, query]);

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.id === orderBy);
    if (!column) return filtered;
    const sign = direction === 'asc' ? 1 : -1;
    // Keep empty values at the bottom regardless of direction
    return [...filtered].sort((a, b) => {
      const av = getValue(a, column);
      const bv = getValue(b, column);
      const aEmpty = av === null || av === undefined || av === '';
      const bEmpty = bv === null || bv === undefined || bv === '';
      if (aEmpty || bEmpty) return compareValues(av, bv);
      return sign * compareValues(av, bv);
    });
  }, [filtered, columns, orderBy, direction]);

  const paginate = sorted.length > rowsPerPage || rowsPerPage !== pageSize;
  const visible = paginate ? sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : sorted;

  const handleSort = (columnId: string) => {
    if (orderBy === columnId) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(columnId);
      setDirection('asc');
    }
    setPage(0);
  };

  return (
    <Box>
      {(title || subtitle) && (
        <Box sx={{ mb: 3 }}>
          {title && (
            <Typography variant="h3" component="h1">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {searchable && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <TextField
              size="small"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              inputProps={{ 'aria-label': searchPlaceholder }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 320 } }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}
            >
              {query ? `${sorted.length} of ${data.length}` : `${data.length}`}{' '}
              {data.length === 1 ? 'row' : 'rows'}
            </Typography>
          </Box>
        )}
        <TableContainer sx={{ maxHeight: 'calc(100vh - 260px)' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, width: column.width }}
                    sortDirection={orderBy === column.id ? direction : false}
                  >
                    {column.sortable === false ? (
                      column.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? direction : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {query ? `No rows match “${query}”.` : emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((row) => (
                  <TableRow
                    hover
                    key={rowId(row)}
                    onClick={onRowClick ? () => onRowClick(rowId(row)) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter') onRowClick(rowId(row));
                          }
                        : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value, row) : value ?? '—'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
            {footer && <TableFooter>{footer}</TableFooter>}
          </Table>
        </TableContainer>
        {paginate && (
          <TablePagination
            component="div"
            count={sorted.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[25, 50, 100]}
            sx={{ borderTop: 1, borderColor: 'divider' }}
          />
        )}
      </Paper>
    </Box>
  );
};
