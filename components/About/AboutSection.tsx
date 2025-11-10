import { AboutData } from '../../store/slices/portfolioSlice';
import CommonTextInput from '../common/CommonTextInput';
import CommonTextareaInput from '../common/CommonTextareaInput';
import styles from './AboutSection.module.scss';
import ErrorMessage from '../Error/ErrorMessage';
import { useFormContext } from 'react-hook-form';
import { aboutValidationConfig } from '../../validationConfig';

interface Props {
    data: AboutData;
    editMode: boolean;
}

export default function AboutSection({ data, editMode }: Props) {
    const { register, formState: { errors } } = useFormContext();
    if(!editMode && (Object.values(data).every(value => !value))) {
        return null;
    }
    return (
        <section>
            <h2 className={styles.heading}>About Me</h2>
            {editMode ? (
                <div className={styles.editFields}>
                    <>
                        <CommonTextInput
                            label="Full Name"
                            placeholder="Full Name"
                            {...register('about.name', {
                                validate: (value: string) => {
                                    for (const test of aboutValidationConfig.name) {
                                        if (!test.test(value)) return test.errorMessage;
                                    }
                                    return true;
                                }
                            })}
                        />
                        {(errors.about as any)?.name?.message && (
                            <ErrorMessage message={(errors.about as any).name.message} />
                        )}
                    </>
                    <>
                        <CommonTextInput
                            label="Professional Title"
                            placeholder="Professional Title"
                            {...register('about.title', {
                                validate: (value: string) => {
                                    for (const test of aboutValidationConfig.title) {
                                        if (!test.test(value)) return test.errorMessage;
                                    }
                                    return true;
                                }
                            })}
                        />
                        {(errors.about as any)?.title?.message && (
                            <ErrorMessage message={(errors.about as any).title.message} />
                        )}
                    </>
                    <>
                        <CommonTextInput
                            label="Email Address"
                            placeholder="Email Address"
                            {...register('about.email', {
                                validate: (value: string) => {
                                    for (const test of aboutValidationConfig.email) {
                                        if (!test.test(value)) return test.errorMessage;
                                    }
                                    return true;
                                }
                            })}
                        />
                        {(errors.about as any)?.email?.message && (
                            <ErrorMessage message={(errors.about as any).email.message} />
                        )}
                    </>
                    <>
                        <CommonTextInput
                            label="Location"
                            placeholder="Location"
                            {...register('about.location', {
                                validate: (value: string) => {
                                    for (const test of aboutValidationConfig.location) {
                                        if (!test.test(value)) return test.errorMessage;
                                    }
                                    return true;
                                }
                            })}
                        />
                        {(errors.about as any)?.location?.message && (
                            <ErrorMessage message={(errors.about as any).location.message} />
                        )}
                    </>
                    <>
                        <CommonTextareaInput
                            label="Bio"
                            placeholder="Bio"
                            {...register('about.bio', {
                                validate: (value: string) => {
                                    for (const test of aboutValidationConfig.bio) {
                                        if (!test.test(value)) return test.errorMessage;
                                    }
                                    return true;
                                }
                            })}
                        />
                        {(errors.about as any)?.bio?.message && (
                            <ErrorMessage message={(errors.about as any).bio.message} />
                        )}
                    </>
                </div>
            ) : (
                <>
                    <p><b>Name:</b> {data.name}</p>
                    <p><b>Title:</b> {data.title}</p>
                    <p><b>Email:</b> {data.email}</p>
                    <p><b>Location:</b> {data.location}</p>
                    <p dangerouslySetInnerHTML={{ __html: data.bio }} />
                </>
            )}
        </section>
    );
}