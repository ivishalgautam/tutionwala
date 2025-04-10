import SignUpStudentForm from "@/forms/signup-student";
import SignUpTutorForm from "@/forms/signup-tutor";
import AuthLayout from "@/components/layout/auth-layout";
import SignUpInstituteForm from "@/forms/signup-institute";

export default function Page({ params: { role } }) {
  return (
    <AuthLayout>
      {role === "student" ? (
        <SignUpStudentForm />
      ) : role === "tutor" ? (
        <SignUpTutorForm />
      ) : (
        <SignUpInstituteForm />
      )}
    </AuthLayout>
  );
}
