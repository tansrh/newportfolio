import { AchievementsData } from '../../store/slices/portfolioSlice';
import CommonTextInput from '../common/CommonTextInput';
import styles from './AchievementsSection.module.scss';
import ErrorMessage from '../Error/ErrorMessage';
import CommonButton from '../common/CommonButton';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { achievementsValidationConfig } from '../../validationConfig';
import CommonTextareaInput from '../common/CommonTextareaInput';

interface Props {
  data: AchievementsData[];
  editMode: boolean;
}

export default function AchievementsSection({ data, editMode }: Props) {
  const { control, register, formState: { errors }, getValues, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'achievements'
  });
  if (!editMode && (!data || data.length === 0)) {
    return null;
  }
  return (
    <section>
      <h2 className={styles.heading}>Achievements</h2>
      {editMode ? (
        <>
          {fields.map((field, idx) => (
            <div key={field.id} className={styles.editItem}>
              <div className={styles.editFields}>
                <>
                  <CommonTextInput
                    label="Achievement Title"
                    defaultValue={getValues(`achievements.${idx}.title`)}
                    placeholder="Achievement Title"
                    {...register(`achievements.${idx}.title`, {
                      validate: (value: string) => {
                        for (const test of achievementsValidationConfig.title) {
                          if (!test.test(value)) return test.errorMessage;
                        }
                        return true;
                      }
                    })}
                  />
                  {Array.isArray(errors.achievements) && errors.achievements[idx]?.title && (
                    <ErrorMessage message={(errors.achievements[idx] as any).title.message} />
                  )}
                </>
                <>
                  <CommonTextInput
                    label="Year"
                    placeholder="Year"
                    defaultValue={getValues(`achievements.${idx}.year`)}
                    {...register(`achievements.${idx}.year`, {
                      validate: (value: string) => {
                        for (const test of achievementsValidationConfig.year) {
                          if (!test.test(value)) return test.errorMessage;
                        }
                        return true;
                      }
                    })}
                  />
                  {Array.isArray(errors.achievements) && errors.achievements[idx]?.year && (
                    <ErrorMessage message={(errors.achievements[idx] as any).year.message} />
                  )}
                </>
                <>
                  <CommonTextareaInput
                    label="Description"
                    placeholder="Description"
                    defaultValue={getValues(`achievements.${idx}.description`)}
                    {...register(`achievements.${idx}.description`, {
                      validate: (value: string) => {
                        for (const test of achievementsValidationConfig.description) {
                          if (!test.test(value)) return test.errorMessage;
                        }
                        return true;
                      }
                    })}
                    setValue={setValue}
                  />
                  {Array.isArray(errors.achievements) && errors.achievements[idx]?.description && (
                    <ErrorMessage message={(errors.achievements[idx] as any).description.message} />
                  )}
                </>
              </div>
              <CommonButton type="button" style={{ marginTop: '0.5rem' }} onClick={() => remove(idx)}>
                Remove
              </CommonButton>
            </div>
          ))}
          <CommonButton type="button" style={{ marginTop: '1rem' }} onClick={() => append({ title: '', year: '', description: '' })}>
            Add Achievement
          </CommonButton>
        </>
      ) : (
        <ul>
          {data.map((ach, idx) => (
            <li key={idx}>
              <b>{ach.title}</b> ({ach.year})<br />
              <span dangerouslySetInnerHTML={{ __html: ach.description || '' }} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}