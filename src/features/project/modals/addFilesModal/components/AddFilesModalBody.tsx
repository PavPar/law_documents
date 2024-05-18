import { Form, Input } from "antd";
import { FileDropZone } from "src/features/project/components/FileDropZone";

export type AddFilesModalBodyProps = {};
export function AddFilesModalBody({}: AddFilesModalBodyProps) {
  return (
    <section>
      <FileDropZone />
    </section>
  );
}
