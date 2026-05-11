'use client';

import { useEffect, useState } from 'react';
import { fetchPublicMasterData } from './api';
import { mapPublicMasterToViewModel, type PublicMasterViewModel } from './mapper';

const INITIAL_VIEW_MODEL: PublicMasterViewModel = {
  roleOptions: [{ id: 'dps', label: 'DPS' }, { id: 'support', label: 'サポート' }],
  characterOptions: [{ id: '', label: '共通' }, { id: 'alice', label: 'Alice（要確認）' }, { id: 'bob', label: 'Bob（要確認）' }],
  statusOptions: [],
  scoreWeightCount: 0,
};

type PublicMasterState = { loading: boolean; warning: string | null; viewModel: PublicMasterViewModel };

export function usePublicMaster(): PublicMasterState {
  const [state, setState] = useState<PublicMasterState>({ loading: true, warning: null, viewModel: INITIAL_VIEW_MODEL });

  useEffect(() => {
    let active = true;
    fetchPublicMasterData().then((result) => {
      if (!active) return;
      setState({ loading: false, warning: result.warning, viewModel: mapPublicMasterToViewModel(result.data) });
    });
    return () => { active = false; };
  }, []);

  return state;
}
