import { MyEventSliceResultManager } from "./MyEventSlice";

const { actions } = MyEventSliceResultManager;

export const setMyResults = myResults => dispatch => {
  dispatch(actions.setEntities(myResults));
};
