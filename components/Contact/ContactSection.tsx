import { ContactData } from '../../store/slices/portfolioSlice';
import CommonTextInput from '../common/CommonTextInput';
import styles from './ContactSection.module.scss';
import ErrorMessage from '../Error/ErrorMessage';
import CommonButton from '../common/CommonButton';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/modalSlice';
import { contactValidationConfig } from '../../validationConfig';

interface Props {
  data: ContactData[];
  editMode: boolean;
}

export default function ContactSection({ data, editMode }: Props) {
  const { control, register, formState: { errors }, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contact'
  });
  const dispatch = useDispatch();
  if(!editMode && (!data || data.length === 0)) {
        return null;
    }
  return (
    <section>
      <h2 className={styles.heading}>Contact</h2>
      {editMode ? (
        <>
          {fields.map((field, idx) => (
            <div key={field.id} className={styles.editItem}>
              <div className={styles.editFields}>
                <>
                  <CommonTextInput
                    label="Contact Method (e.g. Email)"
                    placeholder="Contact Method (e.g. Email)"
                    defaultValue={getValues(`contact.${idx}.method`)}
                    {...register(`contact.${idx}.method`, {
                      validate: (value: string) => {
                        for (const test of contactValidationConfig.method) {
                          if (!test.test(value)) return test.errorMessage;
                        }
                        return true;
                      }
                    })}
                  />
                  {Array.isArray(errors.contact) && errors.contact[idx]?.method && (
                    <ErrorMessage message={(errors.contact[idx] as any).method.message} />
                  )}
                </>
                <>
                  <CommonTextInput
                    label="Contact Value"
                    placeholder="Contact Value"
                    defaultValue={getValues(`contact.${idx}.value`)}
                    {...register(`contact.${idx}.value`, {
                      validate: (value: string) => {
                        for (const test of contactValidationConfig.value) {
                          if (!test.test(value)) return test.errorMessage;
                        }
                        return true;
                      }
                    })}
                  />
                  {Array.isArray(errors.contact) && errors.contact[idx]?.value && (
                    <ErrorMessage message={(errors.contact[idx] as any).value.message} />
                  )}
                </>
              </div>
              <CommonButton type="button" style={{ marginTop: '0.5rem' }} onClick={() => remove(idx)}>
                Remove
              </CommonButton>
            </div>
          ))}
          <CommonButton type="button" style={{ marginTop: '1rem' }} onClick={() => append({ method: '', value: '' })}>
            Add Contact
          </CommonButton>
        </>
      ) : (
        <ul>
          {data.map((contact, idx) => (
            <li key={idx}>
              <b>{contact.method}:</b> {contact.value}
            </li>
          ))}
          <li
            className={styles.messageLink}
            onClick={() => dispatch(openModal({ content: 'Message' }))}
          >
            Send me a message?
          </li>
        </ul>
      )}
    </section>
  );
}