import React, { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableFooter,
  TablePagination,
} from '@mui/material';
//import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteResource } from '../services/api';
import ResourceForm from './ResourceForm';
import DeleteModal from './DeleteModal';
interface Resource {
  _id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes: string;
  status: string;
  createdAt: string;
}
interface ResourceTableProps {
  resources: Resource[];
  onDelete: () => void;
  onSave: () => void;

}
const ResourceTable: React.FC<ResourceTableProps> = ({ resources,onDelete,onSave }) => {


  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {onDelete();},
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resourceBeingEdited, setResourceBeingEdited] = useState<Resource | null>(null);

  const handleEdit = (resource: Resource) => {
    setResourceBeingEdited(resource);
    setEditModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Resource>[]>(
    () => [
      { header: 'Title', accessorKey: 'title' },
      {
        header: 'URL',
        accessorKey: 'url',
        cell: ({ getValue }) => (
          <a href={getValue() as string} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ),
      },
      { header: 'Category', accessorKey: 'category' },
      {
        header: 'Tags',
        accessorKey: 'tags',
        cell: ({ getValue }) => (getValue() as string[]).join(', '),
      },
      { header: 'Status', accessorKey: 'status' },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <>
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() => handleEdit(row.original)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          <DeleteModal
            resourceId={row.original._id}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
          </>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: resources || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });
  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No resources found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={resources?.length ?? 0}
                  rowsPerPage={table.getState().pagination.pageSize}
                  page={table.getState().pagination.pageIndex}
                  onPageChange={(_, newPage) => table.setPageIndex(newPage)}
                  onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
                  component="div"
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      {editModalOpen && resourceBeingEdited && (
        <ResourceForm
          isOpen={editModalOpen}
          resource={resourceBeingEdited}
          onClose={() => {
            setEditModalOpen(false);
            setResourceBeingEdited(null);
          }}
          onSave={() => {
            setEditModalOpen(false);
            setResourceBeingEdited(null);
            onSave(); // Refresh updated data
          }}
        />
      )}
    </>
  );
};

export default ResourceTable;
