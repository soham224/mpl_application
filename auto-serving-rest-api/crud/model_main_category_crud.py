from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models import AIModels
from models.model_main_category import ModelMainCategory
from schemas.model_main_category import *


class CRUDModelMainCategory(
    CRUDBase[ModelMainCategory, ModelMainCategoryCreate, ModelMainCategoryUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_model_category_id(self, db: Session, deployment_type_id: int):
        return (
            db.query(AIModels)
            .join(ModelMainCategory)
            .filter(ModelMainCategory.id == deployment_type_id)
            .all()
        )

    def get_enabled_by_model_category_id(self, db: Session, deployment_type_id: int):
        return (
            db.query(AIModels)
            .filter(AIModels.status == True)
            .join(ModelMainCategory)
            .filter(ModelMainCategory.id == deployment_type_id)
            .all()
        )

    def get_models_by_list_of_model_category_id(
        self, db: Session, deployment_type_id: list
    ):
        return (
            db.query(AIModels)
            .filter(AIModels.model_category_id.in_(deployment_type_id))
            .filter(AIModels.status == True)
            .filter(AIModels.user_id == None)
            .all()
        )


model_main_category_crud_obj = CRUDModelMainCategory(ModelMainCategory)
