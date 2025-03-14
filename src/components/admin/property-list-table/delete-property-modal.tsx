// src/components/admin/property-list-table/delete-property-modal.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeletePropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  isBulkDelete?: boolean;
  count?: number;
}

export function DeletePropertyModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  isBulkDelete = false,
  count = 0,
}: DeletePropertyModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBulkDelete
              ? `¿Eliminar ${count} propiedades seleccionadas?`
              : `¿Eliminar la propiedad?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBulkDelete
              ? `Estás a punto de eliminar ${count} propiedades seleccionadas. Esta acción no se puede deshacer.`
              : `Estás a punto de eliminar la propiedad "${title}". Esta acción no se puede deshacer.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
