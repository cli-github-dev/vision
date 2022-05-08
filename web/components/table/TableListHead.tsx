// material
import { visuallyHidden } from '@mui/utils';
import {
  Box,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
} from '@mui/material';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { queryHeads } from '@libs/atoms';

// ----------------------------------------------------------------------

interface UserListHeadProps {
  order: 'desc' | 'asc';
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    property: string
  ) => void;
}

export default function TableListHead({
  order,
  orderBy,
  onRequestSort,
}: UserListHeadProps) {
  const head = useRecoilValue(queryHeads);
  const createSortHandler =
    (property: string) =>
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {head &&
          head.map((headCell) => (
            <TableCell
              key={headCell.id}
              align='center'
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {headCell.label}
              <TableSortLabel
                hideSortIcon
                // active={orderBy === headCell.id}
                active
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {/* {orderBy === headCell.id ? ( */}
                  <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                {/* ) : null} */}
              </TableSortLabel>
              </Box>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}
