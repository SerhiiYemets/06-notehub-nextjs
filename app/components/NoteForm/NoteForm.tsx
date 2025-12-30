import { useId } from 'react';
import type { NewNote } from '../../types/note';
import css from './NoteForm.module.css';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/app/lib/api';

const NoteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title must have at least 3 symbols.")
        .max(50, "Title length more then 50 symbols.")
        .required("Title is required."),
    content: Yup.string().max(500, "Content is too long."),
    tag: Yup.string()
        .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"])
        .required("Tag is required."),
});

const initialValues: NewNote = {
    title: "",
    content: "",
    tag: "Todo",
};

interface NoteFormProps {
    onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
    const fieldId = useId();

    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: (newNote: NewNote) => createNote(newNote),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
    });

    const handleSubmit = (values: NewNote) => {
        createTaskMutation.mutate(values);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={NoteFormSchema}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-title`}>Title</label>
                    <Field
                        id={`${fieldId}-title`}
                        type="text"
                        name="title"
                        className={css.input}
                    />
                    <ErrorMessage component="span" name="title" className={css.error} />
                </div>
                
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-content`}>Content</label>
                    <Field
                        as="textarea"
                        id={`${fieldId}-content`}
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage component="span" name="content" className={css.error} />
                </div>
                
                <div className={css.formGroup}>
                    <label htmlFor={`${fieldId}-tag`}>Tag</label>
                    <Field
                        as="select"
                        id={`${fieldId}-tag`}
                        name="tag"
                        className={css.select}
                    >
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage component="span" name="tag" className={css.error} />
                </div>
                <div className={css.actions}>
                    <button
                        type="button"
                        className={css.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={createTaskMutation.isPending}>
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    );
}

