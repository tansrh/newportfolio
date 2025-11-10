import React from 'react';
import Link from 'next/link';
import { useFormContext, useFieldArray } from 'react-hook-form';
import CommonTextInput from '../common/CommonTextInput';
import CommonTextareaInput from '../common/CommonTextareaInput';
import CommonButton from '../common/CommonButton';
import styles from './ProjectsSection.module.scss';
import { projectsValidationConfig } from '../../validationConfig';

export interface ProjectData {
    title: string;
    description: string;
    link?: string;
}

interface Props {
    data: ProjectData[];
    editMode: boolean;
}

export default function ProjectsSection({ data, editMode }: Props) {
    const { control, register, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'projects'
    });
    if(!editMode && (!data || data.length === 0)) {
        return null;
    }

    return (
        <section>
            <h2 className={styles.heading}>Projects</h2>
            {editMode ? (
                <>
                    {fields.map((field, idx) => (
                        <div key={field.id} className={styles.editItem}>
                            <div className={styles.editFields}>
                                <CommonTextInput
                                    label="Project Title"
                                    placeholder="Project Title"
                                    {...register(`projects.${idx}.title`, {
                                        validate: (value: string) => {
                                            for (const test of projectsValidationConfig.title) {
                                                if (!test.test(value)) return test.errorMessage;
                                            }
                                            return true;
                                        }
                                    })}
                                />
                                {Array.isArray(errors.projects) && errors.projects[idx]?.title && (
                                    <span style={{ color: 'red', fontSize: '0.9rem' }}>{(errors.projects[idx] as any).title.message}</span>
                                )}
                                <CommonTextareaInput
                                    label="Project Description"
                                    placeholder="Project Description"
                                    {...register(`projects.${idx}.description`, {
                                        validate: (value: string) => {
                                            for (const test of projectsValidationConfig.description) {
                                                if (!test.test(value)) return test.errorMessage;
                                            }
                                            return true;
                                        }
                                    })}
                                />
                                {Array.isArray(errors.projects) && errors.projects[idx]?.description && (
                                    <span style={{ color: 'red', fontSize: '0.9rem' }}>{(errors.projects[idx] as any).description.message}</span>
                                )}
                                <CommonTextInput
                                    label="Project Link (URL)"
                                    placeholder="Project Link (URL)"
                                    {...register(`projects.${idx}.link`, {
                                        validate: (value: string) => {
                                            for (const test of projectsValidationConfig.link) {
                                                if (!test.test(value)) return test.errorMessage;
                                            }
                                            return true;
                                        }
                                    })}
                                />
                                {Array.isArray(errors.projects) && errors.projects[idx]?.link && (
                                    <span style={{ color: 'red', fontSize: '0.9rem' }}>{(errors.projects[idx] as any).link.message}</span>
                                )}
                            </div>
                            <CommonButton type="button" style={{ marginTop: '0.5rem' }} onClick={() => remove(idx)}>
                                Remove
                            </CommonButton>
                        </div>
                    ))}
                    <CommonButton type="button" style={{ marginTop: '1rem' }} onClick={() => append({ title: '', description: '', link: '' })}>
                        Add Project
                    </CommonButton>
                </>
            ) : (
                <ul>
                    {data.map((project, idx) => (
                        <li key={idx}>
                            <b>{project.title}</b><br />
                            <span dangerouslySetInnerHTML={{ __html: project.description }} /><br />
                            {project.link && (
                                <Link href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                                    {project.link}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
