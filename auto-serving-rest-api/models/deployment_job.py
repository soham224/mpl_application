from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class DeploymentJob(Base):
    __tablename__ = "deployment_job"
    id = Column(Integer, primary_key=True, index=True)
    image_size = Column(String(255), nullable=False)
    confidence_threshold = Column(String(255), nullable=False)
    iou_threshold = Column(String(255), nullable=False)
    start_time = Column(String(255), nullable=True)
    end_time = Column(String(255), nullable=True)

    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)

    model_id = Column(Integer, ForeignKey("ai_models.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    deployment_type_id = Column(Integer, ForeignKey("deployment_type.id"))

    model_details = relationship("AIModels", uselist=False)
    user_details = relationship("User", uselist=False)
    deployment_type = relationship("DeploymentType", uselist=False)
