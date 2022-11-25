import {
  Component,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  Input,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-modal-dialog",
  templateUrl: "./modal-dialog.component.html",
  styleUrls: ["./modal-dialog.component.css"],
})
export class ModalDialogComponent {
  @ViewChild("content", { read: TemplateRef, static: true })
  modalRef!: ViewContainerRef;
  @Input() size: string = "md";
  @Input() modal_title: string = "My Title";
  closeModal: any;
  constructor(private modalService: NgbModal) {}

  open() {
    this.modalService.open(this.modalRef, {
      ariaLabelledBy: "modal-basic-title",
      animation: true,
      size: this.size,
    });
  }

  close() {
    this.modalService.dismissAll();
  }
}
