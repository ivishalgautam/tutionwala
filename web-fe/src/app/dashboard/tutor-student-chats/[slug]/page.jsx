import Chat from "@/components/chat";

export default function ChatPage({ params: { slug: tutorStudentMapId } }) {
  return <Chat tutorStudentMapId={tutorStudentMapId} />;
}
