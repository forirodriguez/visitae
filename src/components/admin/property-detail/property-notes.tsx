"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, SendHorizontal, Trash2 } from "lucide-react";
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

interface Note {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface PropertyNotesProps {
  notes: Note[];
  onAddNote: (content: string) => Promise<void> | void;
}

export default function PropertyNotes({
  notes,
  onAddNote,
}: PropertyNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(newNote);
      setNewNote("");
    } catch (error) {
      console.error("Error al añadir nota:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteNote = () => {
    // Simulamos la eliminación de la nota
    // En una implementación real, llamaríamos a una API
    console.log(`Nota eliminada: ${noteToDelete}`);
    setDeleteConfirmOpen(false);
    setNoteToDelete(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Notas</h3>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Añadir una nota sobre esta propiedad..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!newNote.trim() || isSubmitting}
            className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <SendHorizontal className="mr-2 h-4 w-4" />
                Añadir nota
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground dark:bg-gray-900">
            Historial de notas
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>No hay notas para esta propiedad.</p>
            <p className="text-sm mt-1">
              Añade la primera nota sobre esta propiedad.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="border rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={note.user.avatar} alt={note.user.name} />
                    <AvatarFallback>
                      {note.user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{note.user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(
                          new Date(note.createdAt),
                          "dd MMM yyyy, HH:mm",
                          {
                            locale: es,
                          }
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-200 whitespace-pre-line">
                      {note.content}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-600"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar nota</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar nota</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta nota? Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteNote}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
