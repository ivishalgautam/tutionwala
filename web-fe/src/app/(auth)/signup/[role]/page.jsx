import SignUpStudentForm from "@/forms/signup-student";
import SignUpTutorForm from "@/forms/signup-tutor";
import AuthLayout from "@/components/layout/auth-layout";

export default function Page({ params: { role } }) {
  return (
    <AuthLayout>
      {role === "student" ? <SignUpStudentForm /> : <SignUpTutorForm />}
    </AuthLayout>
  );
}
