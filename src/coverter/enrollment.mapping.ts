import { IEnrollmentResponse as IEnrollmentDTO } from '../interfaces/dto/user.dto'

export function convertToEnrollmentDTO(item: any): IEnrollmentDTO {
  return {
    lectureId: item?.lecture,
    stage: item?.stage,
    currentStep: item?.current_step,
    enrollmentId: item?._id
  }
}
