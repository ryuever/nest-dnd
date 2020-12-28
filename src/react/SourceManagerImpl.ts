import { SourceManagerImplProps } from './types';
import TargetManagerImpl from './TargetManagerImpl';

let count = 0;

class SourceManagerImpl {
  private _id: string;
  private _targetContext: TargetManagerImpl;

  constructor(props: SourceManagerImplProps) {
    const { targetContext } = props;
    this._targetContext = targetContext;

    this._id = `__nest_dnd_source_${count++}__`;
  }

  getId() {
    return this._id;
  }

  getTargetContext() {
    return this._targetContext;
  }
}

export default SourceManagerImpl;
