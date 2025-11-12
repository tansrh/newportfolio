import { ExperienceData } from '../../store/slices/portfolioSlice';
import CommonTextInput from '../common/CommonTextInput';
import CommonDateInput from '../common/CommonDateInput';
import CommonCheckboxInput from '../common/CommonCheckboxInput';
import CommonButton from '../common/CommonButton';
import styles from './ExperienceSection.module.scss';
import ErrorMessage from '../Error/ErrorMessage';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { experienceValidationConfig } from '../../validationConfig';
import CommonTextareaInput from '../common/CommonTextareaInput';

interface Props {
    data: ExperienceData[];
    editMode: boolean;
}

export default function ExperienceSection({ data, editMode }: Props) {
    const { control, register, formState: { errors }, getValues, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'experience'
    });
    if (!editMode && (!data || data.length === 0)) {
        return null;
    }
    return (
        <section>
            <h2 className={styles.heading}>Work Experience</h2>
            {editMode ? (
                <>
                    {fields.map((field, idx) => (
                        // Watch isCurrent for this experience entry
                        <ExperienceItem
                            key={field.id}
                            idx={idx}
                            errors={errors}
                            register={register}
                            remove={remove}
                            control={control}
                            getValues={getValues}
                            setValue={setValue}
                        />
                    ))}
                    <CommonButton type="button" style={{ marginTop: '1rem' }} onClick={() => append({ organisation: '', designation: '', from: '', to: '', isCurrent: false, description: '' })}>
                        Add Experience
                    </CommonButton>
                </>
            ) : (
                
                    <>
                        {data.map((exp, idx) => (
                            <div key={idx} className={styles.experienceItem}>
                                {/* Header section for title, organization, and dates */}
                                <div className={styles.experienceHeader}>
                                    <span className={styles.designation}>{exp.designation}</span>
                                    <span className={styles.organization}> @{exp.organisation}</span>
                                    
                                </div>
                                <div className={styles.dates}>From: {exp.from} - {exp.isCurrent ? 'Present' : exp.to}</div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: exp.description || '' }}
                                />
                            </div>
                        ))}
                    </>
            )}
        </section>
    );
}

interface ExperienceItemProps {
    idx: number;
    errors: any;
    register: any;
    remove: (idx: number) => void;
    control: any;
    getValues: any;
    setValue?: any;
}

function ExperienceItem({ idx, errors, register, remove, control, getValues, setValue }: ExperienceItemProps) {
    const isCurrent = useWatch({ control, name: `experience.${idx}.isCurrent` });
    return (
        <div key={idx} className={styles.editItem}>
            <div className={styles.editFields}>
                <>
                    <CommonTextInput
                        label="Organisation"
                        placeholder="Organisation"
                        defaultValue={getValues(`experience.${idx}.organisation`)}
                        {...register(`experience.${idx}.organisation`, {
                            validate: (value: string) => {
                                for (const test of experienceValidationConfig.organisation) {
                                    if (!test.test(value)) return test.errorMessage;
                                }
                                return true;
                            }
                        })}
                    />
                    {Array.isArray(errors.experience) && errors.experience[idx]?.organisation && (
                        <ErrorMessage message={(errors.experience[idx] as any).organisation.message} />
                    )}
                </>
                <>
                    <CommonTextInput
                        label="Designation"
                        placeholder="Designation"
                        defaultValue={getValues(`experience.${idx}.designation`)}
                        {...register(`experience.${idx}.designation`, {
                            validate: (value: string) => {
                                for (const test of experienceValidationConfig.designation) {
                                    if (!test.test(value)) return test.errorMessage;
                                }
                                return true;
                            }
                        })}
                    />
                    {Array.isArray(errors.experience) && errors.experience[idx]?.designation && (
                        <ErrorMessage message={(errors.experience[idx] as any).designation.message} />
                    )}
                </>
                <CommonDateInput
                    label='From:'
                    defaultValue={getValues(`experience.${idx}.from`)}
                    {...register(`experience.${idx}.from`, {
                        validate: (value: string) => {
                            for (const test of experienceValidationConfig.from) {
                                if (!test.test(value)) return test.errorMessage;
                            }
                            return true;
                        }
                    })}
                />
                {Array.isArray(errors.experience) && errors.experience[idx]?.from && (
                    <ErrorMessage message={(errors.experience[idx] as any).from.message} />
                )}
                {!isCurrent && (
                    <CommonDateInput
                        label='To:'
                        defaultValue={getValues(`experience.${idx}.to`)}
                        {...register(`experience.${idx}.to`)}
                    />
                )}
                <CommonCheckboxInput label="Current" {...register(`experience.${idx}.isCurrent`)} />
                <>
                    <CommonTextareaInput
                        label="Role Description"
                        placeholder="Role Description"
                        defaultValue={getValues(`experience.${idx}.description`)}
                        {...register(`experience.${idx}.description`, {
                            validate: (value: string) => {
                                for (const test of experienceValidationConfig.description) {
                                    if (!test.test(value)) return test.errorMessage;
                                }
                                return true;
                            }
                        })}
                        setValue={setValue}
                    />
                    {Array.isArray(errors.experience) && errors.experience[idx]?.description && (
                        <ErrorMessage message={(errors.experience[idx] as any).description.message} />
                    )}
                </>
            </div>
            <CommonButton type="button" style={{ marginTop: '0.5rem' }} onClick={() => remove(idx)}>
                Remove
            </CommonButton>
        </div>
    );
}