"use client";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

const RegisterForm = ({user}:{user:User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {

    setIsLoading(true);
    let formData;

    if(values.identificationDocument && values.identificationDocument?.length > 0){
        const blobFile = 
        new Blob([values.identificationDocument[0]],
        {
            type:values.identificationDocument[0].type,
        })
        formData = new FormData();
        formData.append("blobFile",blobFile);
        formData.append('fileName',values.identificationDocument[0].name)
    }
    try {
      const patientData = {
        ...values,
        userId:user.$id,
        birthDate:new Date(values.birthDate),
        identificationDocument: formData,
      };
     
      //@ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <section className="space-y-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Full name"
              placeholder="John Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
                />

                <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="(555) 123-4567"
                />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of Birth"
                />

                <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={(field)=>(
                    <FormControl>
                        <RadioGroup className="flex gap-6 h-11 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                            {GenderOptions.map((option,i)=>(
                                <div key={option+i} className="radio-group">
                                    <RadioGroupItem value={option} id={option}/>
                                    <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                        
                                </div>
                            ))}
                            </RadioGroup>
                    </FormControl>
                )}
                />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="14 street, city, country"
                />

                <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Software Engineer"
                />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="emergencyContactName"
                    label="Emergency contact name"
                    placeholder="Guardian's Name"
                />

                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="emergencyContactNumber"
                    label="Emergency contact number"
                    placeholder="(555) 123-4567"
                />
            
            </div>  
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        

        <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary physician"
                placeholder="Select a primary physician"
        >
            {Doctors.map((doctor,i)=>(
                <SelectItem key={doctor.name + i} value={doctor.name} >
                    <div className="flex cursor-pointer items-center gap-2">
                        <Image src={doctor.image} alt="doctor" width={32} height={32} className="rounded-full border-dark-500"
                        />
                        <p>{doctor.name}</p>
                    </div>
                    
                </SelectItem>
            ))}

            </CustomFormField>
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Insurance provider"
                placeholder="eg. Lic"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Insurance policy number"
                placeholder="ABR3444432222"
            />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="=allergies"
                label="Allergies"
                placeholder="dust,peanuts,etc"
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Current medication (if any)"
                placeholder="paracetamol (500mg), dolo (650mg),etc"
            />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label="Family medical history"
                placeholder="Mother has diabeties and father is heart patient"
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past medical history"
                placeholder="Had a surgery in 2019, etc"
            />
        </div>
      </section>
      <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        
        <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Identification type"
                placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}

        </CustomFormField>

        <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="identificationNumber"
                label="Identification number"
                placeholder="1245XXXX"
        />

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scannned copy of identification document"
            renderSkeleton={(field)=>(
                <FormControl>
                    <FileUploader files={field.value}
                    onChange={field.onChange} />
                </FormControl>
            )}
            />
      </section>
      <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatement and care"
            />
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to disclosure of information"
            />
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I agree to the privacy policy"
            />
      </section>
        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};
export default RegisterForm;