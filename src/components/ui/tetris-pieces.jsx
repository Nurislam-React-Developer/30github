import { motion } from 'framer-motion';

export const IPiece = ({ className, initial }) => (
  <motion.div className={className} initial={initial}>
    <div style={{ width: 15, height: 60, backgroundColor: '#00f0f0' }} />
  </motion.div>
);

export const JPiece = ({ className, initial }) => (
  <motion.div className={className} initial={initial}>
    <div style={{ width: 45, height: 15, backgroundColor: '#0000f0' }} />
    <div style={{ width: 15, height: 30, backgroundColor: '#0000f0', marginLeft: 30 }} />
  </motion.div>
);

export const LPiece = ({ className, initial }) => (
  <motion.div className={className} initial={initial}>
    <div style={{ width: 45, height: 15, backgroundColor: '#f0a000' }} />
    <div style={{ width: 15, height: 30, backgroundColor: '#f0a000' }} />
  </motion.div>
);

export const OPiece = ({ className, initial }) => (
  <motion.div className={className} initial={initial}>
    <div style={{ width: 30, height: 30, backgroundColor: '#f0f000' }} />
  </motion.div>
);

export const SPiece = ({ className, initial }) => (
  <motion.div className={className} initial={initial}>
    <div style={{ display: 'flex' }}>
      <div style={{ width: 30, height: 15, backgroundColor: '#00f000', marginLeft: 15 }} />
    </div>
    <div style={{ display: 'flex' }}>
      <div style={{ width: 30, height: 15, backgroundColor: '#00f000' }} />
    </div>
  </motion.div>
);

export const TPiece = ({ className, initial }) => (
  <motion.div className={className} initial={initial}>
    <div style={{ width: 45, height: 15, backgroundColor: '#a000f0' }} />
    <div style={{ width: 15, height: 15, backgroundColor: '#a000f0', marginLeft: 15 }} />
  </motion.div>
);

export const ZPiece = ({ className, initial }) => (
  <motion.div className={className} initial={initial}>
    <div style={{ display: 'flex' }}>
      <div style={{ width: 30, height: 15, backgroundColor: '#f00000' }} />
    </div>
    <div style={{ display: 'flex' }}>
      <div style={{ width: 30, height: 15, backgroundColor: '#f00000', marginLeft: 15 }} />
    </div>
  </motion.div>
);